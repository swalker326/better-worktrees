import { stat } from "node:fs/promises";
import { resolveOpenPathSubmission, resolveTabCompletion } from "../../openPathAutocomplete";
import {
  isRepoFile,
  resolveRuleSubmission,
  resolveRuleTabCompletion,
} from "../../repoFileAutocomplete";
import { DEFAULT_TEMPLATE, type AppState, type Command, type RepoItem } from "../types";
import type { AppAction } from "../reducer";
import type { createTuiEffects } from "../effects";
import { nextIndex, prevIndex } from "../selectors";

type Dispatch = (action: AppAction) => void;
type TuiEffects = ReturnType<typeof createTuiEffects>;

export type CommandContext = {
  state: AppState;
  dispatch: Dispatch;
  effects: TuiEffects;
  selectedRepo: RepoItem | null;
  selectedWorktree: AppState["worktrees"][number] | null;
  runBusyTask: (task: () => Promise<void>) => Promise<void>;
  activateRepo: (repoPath: string, persist?: boolean) => Promise<void>;
  setMode: (mode: AppState["mode"]) => void;
  refreshWorktrees: () => Promise<void>;
  allRepos: RepoItem[];
};

function parseRuleDraft(draft: string): { from: string; to: string } | null {
  const [from, to] = draft.trim().split(":");
  if (!from) {
    return null;
  }
  return { from, to: to || from };
}

export async function handleModeCommand(
  command: Command,
  context: CommandContext,
): Promise<boolean | null> {
  const {
    state,
    dispatch,
    effects,
    selectedWorktree,
    runBusyTask,
    activateRepo,
  } = context;

  if (state.mode === "openPath") {
    if (command === "closeMode") {
      dispatch({ type: "closeOpenPath" });
      return false;
    }
    if (command === "navigateNext") {
      dispatch({
        type: "setOpenSuggestionIndex",
        value: nextIndex(state.openSuggestionIndex, state.openSuggestions.length),
      });
      return false;
    }
    if (command === "navigatePrev") {
      dispatch({
        type: "setOpenSuggestionIndex",
        value: prevIndex(state.openSuggestionIndex, state.openSuggestions.length),
      });
      return false;
    }
    if (command === "tabComplete") {
      const completion = resolveTabCompletion(
        state.openDraft,
        state.openCompletion,
        state.openSuggestions,
        state.openSuggestionIndex,
      );
      if (completion) {
        dispatch({ type: "setOpenDraft", value: completion });
      }
      return false;
    }
    if (command === "submit") {
      const submission = resolveOpenPathSubmission(
        state.openDraft,
        state.openSuggestions,
        state.openSuggestionIndex,
      );
      if (!submission) {
        dispatch({ type: "setStatus", value: "Path is required" });
        return false;
      }

      try {
        const details = await stat(submission);
        if (!details.isDirectory()) {
          dispatch({ type: "setStatus", value: "Path must be a directory" });
          return false;
        }
      } catch {
        dispatch({ type: "setStatus", value: "Directory does not exist" });
        return false;
      }

      await runBusyTask(async () => {
        await activateRepo(submission, false);
        dispatch({
          type: "setStatus",
          value: "Opened path and resolved root worktrees",
        });
        dispatch({ type: "closeOpenPath" });
      });
      return false;
    }

    return null;
  }

  if (state.mode === "createWorktree") {
    if (command === "closeMode") {
      dispatch({ type: "closeCreate" });
      return false;
    }
    if (command === "submit") {
      const branch = state.createDraft.trim();
      if (!state.activeRepoPath || !branch) {
        dispatch({
          type: "setStatus",
          value: "Active repo and branch are required",
        });
        return false;
      }

      await runBusyTask(async () => {
        const worktrees = await effects.createRepoWorktree(state.activeRepoPath!, branch);
        dispatch({ type: "setWorktrees", value: worktrees });
        dispatch({ type: "setStatus", value: "Created worktree" });
        dispatch({ type: "closeCreate" });
      });
      return false;
    }

    return null;
  }

  if (state.mode === "confirmDelete") {
    if (command === "closeMode") {
      dispatch({ type: "closeDelete" });
      return false;
    }
    if (command === "deleteConfirm") {
      if (!state.activeRepoPath || !selectedWorktree) {
        return false;
      }

      await runBusyTask(async () => {
        const worktrees = await effects.deleteRepoWorktree(
          state.activeRepoPath!,
          selectedWorktree.path,
        );
        dispatch({ type: "setWorktrees", value: worktrees });
        dispatch({ type: "setStatus", value: "Deleted worktree" });
        dispatch({ type: "closeDelete" });
      });
      return false;
    }

    return null;
  }

  if (state.mode === "settingsBrowse") {
    if (command === "closeMode") {
      dispatch({ type: "setMode", value: "browse" });
      return false;
    }
    if (command === "navigateNext") {
      dispatch({
        type: "setSettingsRuleIndex",
        value: nextIndex(
          state.settingsRuleIndex,
          state.repoSettings?.copyAfterCreate?.length ?? 0,
        ),
      });
      return false;
    }
    if (command === "navigatePrev") {
      dispatch({
        type: "setSettingsRuleIndex",
        value: prevIndex(
          state.settingsRuleIndex,
          state.repoSettings?.copyAfterCreate?.length ?? 0,
        ),
      });
      return false;
    }
    if (command === "editRule") {
      dispatch({ type: "setRuleDraft", value: "" });
      dispatch({ type: "setMode", value: "settingsEditRule" });
      return false;
    }
    if (command === "removeRule") {
      if (!state.activeRepoPath) {
        return false;
      }
      const rules = state.repoSettings?.copyAfterCreate ?? [];
      if (!rules[state.settingsRuleIndex]) {
        return false;
      }
      const nextRules = rules.filter((_, index) => index !== state.settingsRuleIndex);
      await runBusyTask(async () => {
        const settings = await effects.saveSettings(state.activeRepoPath!, {
          nameTemplate: state.repoSettings?.nameTemplate ?? DEFAULT_TEMPLATE,
          copyAfterCreate: nextRules,
        });
        dispatch({ type: "setRepoSettings", value: settings });
        dispatch({
          type: "setTemplateDraft",
          value: settings.nameTemplate ?? DEFAULT_TEMPLATE,
        });
        dispatch({ type: "setStatus", value: "Removed copy rule" });
      });
      return false;
    }

    return null;
  }

  if (state.mode === "settingsEditRule") {
    if (command === "closeMode") {
      dispatch({ type: "setMode", value: "settingsBrowse" });
      return false;
    }

    if (command === "navigateNext") {
      dispatch({
        type: "setRuleSuggestionIndex",
        value: nextIndex(state.ruleSuggestionIndex, state.ruleSuggestions.length),
      });
      return false;
    }

    if (command === "navigatePrev") {
      dispatch({
        type: "setRuleSuggestionIndex",
        value: prevIndex(state.ruleSuggestionIndex, state.ruleSuggestions.length),
      });
      return false;
    }

    if (command === "tabComplete") {
      const completion = resolveRuleTabCompletion(
        state.ruleDraft,
        state.ruleCompletion,
        state.ruleSuggestions,
        state.ruleSuggestionIndex,
      );
      if (completion) {
        dispatch({ type: "setRuleDraft", value: completion });
      }
      return false;
    }

    if (command === "submit" && state.activeRepoPath) {
      const submission = resolveRuleSubmission(
        state.ruleDraft,
        state.ruleSuggestions,
        state.ruleSuggestionIndex,
      );
      const parsedRule = parseRuleDraft(submission ?? "");
      if (!parsedRule) {
        dispatch({
          type: "setStatus",
          value: "Select a file to copy",
        });
        return false;
      }

      const isFile = await isRepoFile(state.activeRepoPath, parsedRule.from);
      if (!isFile) {
        dispatch({
          type: "setStatus",
          value: "Select a file (directories are for navigation)",
        });
        return false;
      }

      await runBusyTask(async () => {
        const rules = state.repoSettings?.copyAfterCreate ?? [];
        const settings = await effects.saveSettings(state.activeRepoPath!, {
          nameTemplate: state.repoSettings?.nameTemplate ?? DEFAULT_TEMPLATE,
          copyAfterCreate: [...rules, parsedRule],
        });
        dispatch({ type: "setRepoSettings", value: settings });
        dispatch({
          type: "setTemplateDraft",
          value: settings.nameTemplate ?? DEFAULT_TEMPLATE,
        });
        dispatch({ type: "setRuleDraft", value: "" });
        dispatch({ type: "setStatus", value: "Added copy rule" });
        dispatch({ type: "setMode", value: "settingsBrowse" });
      });
    }
    return false;
  }

  return null;
}
