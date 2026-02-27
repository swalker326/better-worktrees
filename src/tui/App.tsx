import { useKeyboard, useRenderer } from "@opentui/react";
import { CreateWorktreeModal } from "./components/CreateWorktreeModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { OpenPathModal } from "./components/modals/OpenPathModal";
import { RepoSelectPanel } from "./components/RepoSelectPanel";
import { RepoSettingsModal } from "./components/RepoSettingsModal";
import { StatusFooter } from "./components/StatusFooter";
import { WorktreeScrollPanel } from "./components/WorktreeScrollPanel";
import { collapseHome } from "./pathDisplay";
import { useAppController } from "./state/useAppController";
import { THEME } from "./theme";

export function App() {
  const renderer = useRenderer();
  const {
    state,
    allRepos,
    selectedWorktree,
    modeLabel,
    helpText,
    handleKey,
    openInputValue,
    openCompletion,
    setRepoIndex,
    setWorktreeIndex,
    setOpenDraft,
    setOpenSuggestionIndex,
    setCreateDraft,
    setRuleDraft,
    setRuleSuggestionIndex,
    activateRepoFromList
  } = useAppController();

  useKeyboard((key) => {
    void handleKey({ name: key.name, ctrl: key.ctrl }).then((shouldQuit) => {
      if (shouldQuit) {
        renderer.destroy();
      }
    });
  });

  const showSettings =
    state.mode === "settingsBrowse" || state.mode === "settingsEditRule";

  const settingsInput =
    state.mode === "settingsEditRule"
        ? "rule"
        : null;

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      backgroundColor={THEME.base}
      padding={1}
      gap={1}
    >
      <box
        border
        borderStyle="double"
        borderColor={THEME.borderFocus}
        backgroundColor={THEME.panelAlt}
        padding={1}
      >
        <text>
          <strong>
            <span fg={THEME.accent}>Better WorkTree</span>
          </strong>
          <span fg={THEME.muted}> O open path P settings R refresh</span>
          <span fg={THEME.muted}> | </span>
          <span fg={THEME.text}>
            {state.activeRepoPath
              ? collapseHome(state.activeRepoPath)
              : "no repo selected"}
          </span>
        </text>
      </box>

      {showSettings ? (
        <RepoSettingsModal
          repoPath={state.activeRepoPath ?? ""}
          settings={state.repoSettings}
          selectedRule={state.settingsRuleIndex}
          inputMode={settingsInput}
          ruleDraft={state.ruleDraft}
          ruleCompletion={state.ruleCompletion}
          ruleSuggestions={state.ruleSuggestions}
          selectedRuleSuggestionIndex={state.ruleSuggestionIndex}
          onChangeRuleDraft={setRuleDraft}
          onChangeRuleSuggestionIndex={setRuleSuggestionIndex}
        />
      ) : (
        <box flexDirection="row" gap={1} flexGrow={1}>
          <RepoSelectPanel
            repos={allRepos}
            activeRepoPath={state.activeRepoPath}
            selectedIndex={state.repoIndex}
            focused={state.activePane === "repos" && state.mode === "browse"}
            onChangeIndex={setRepoIndex}
            onSelectIndex={(index) => {
              void activateRepoFromList(index);
            }}
          />

          <WorktreeScrollPanel
            repoPath={state.activeRepoPath}
            worktrees={state.worktrees}
            selectedIndex={state.worktreeIndex}
            focused={
              state.activePane === "worktrees" && state.mode === "browse"
            }
            onChangeIndex={setWorktreeIndex}
            onSelectIndex={setWorktreeIndex}
          />
        </box>
      )}

      {state.mode === "openPath" ? (
        <OpenPathModal
          draft={openInputValue}
          completion={openCompletion}
          suggestions={state.openSuggestions}
          selectedSuggestionIndex={state.openSuggestionIndex}
          onChangeDraft={setOpenDraft}
          onChangeSuggestionIndex={setOpenSuggestionIndex}
        />
      ) : null}

      {state.mode === "createWorktree" ? (
        <CreateWorktreeModal
          draft={state.createDraft}
          onChangeDraft={setCreateDraft}
        />
      ) : null}

      {state.mode === "confirmDelete" && selectedWorktree ? (
        <DeleteConfirmModal target={selectedWorktree.path} />
      ) : null}

      <StatusFooter
        mode={modeLabel}
        status={state.busy ? "Working..." : state.status}
        help={helpText}
      />
    </box>
  );
}
