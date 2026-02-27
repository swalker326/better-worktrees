import { clamp } from "./selectors";
import type { AppState, Mode, SavedRepo } from "./types";

export type AppAction =
  | { type: "setBusy"; value: boolean }
  | { type: "setStatus"; value: string }
  | { type: "setMode"; value: Mode }
  | { type: "setActivePane"; value: AppState["activePane"] }
  | { type: "setSavedRepos"; value: SavedRepo[] }
  | { type: "setOpenedRepoPaths"; value: string[] }
  | { type: "setActiveRepoPath"; value: string | null }
  | { type: "setRepoIndex"; value: number }
  | { type: "setWorktrees"; value: AppState["worktrees"] }
  | { type: "setWorktreeIndex"; value: number }
  | { type: "setRepoSettings"; value: AppState["repoSettings"] }
  | { type: "setSettingsRuleIndex"; value: number }
  | { type: "setTemplateDraft"; value: string }
  | { type: "setRuleDraft"; value: string }
  | { type: "setRuleCompletion"; value: string | null }
  | { type: "setRuleSuggestions"; value: AppState["ruleSuggestions"] }
  | { type: "setRuleSuggestionIndex"; value: number }
  | { type: "setOpenDraft"; value: string }
  | { type: "setOpenCompletion"; value: string | null }
  | { type: "setOpenSuggestions"; value: AppState["openSuggestions"] }
  | { type: "setOpenSuggestionIndex"; value: number }
  | { type: "setCreateDraft"; value: string }
  | { type: "setBootstrapData"; value: Partial<AppState> }
  | { type: "closeOpenPath" }
  | { type: "closeCreate" }
  | { type: "closeDelete" };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setBusy":
      return { ...state, busy: action.value };
    case "setStatus":
      return { ...state, status: action.value };
    case "setMode":
      return { ...state, mode: action.value };
    case "setActivePane":
      return { ...state, activePane: action.value };
    case "setSavedRepos":
      return { ...state, savedRepos: action.value };
    case "setOpenedRepoPaths":
      return { ...state, openedRepoPaths: action.value };
    case "setActiveRepoPath":
      return { ...state, activeRepoPath: action.value };
    case "setRepoIndex":
      return { ...state, repoIndex: action.value };
    case "setWorktrees":
      return {
        ...state,
        worktrees: action.value,
        worktreeIndex: clamp(state.worktreeIndex, action.value.length),
      };
    case "setWorktreeIndex":
      return { ...state, worktreeIndex: action.value };
    case "setRepoSettings":
      return { ...state, repoSettings: action.value };
    case "setSettingsRuleIndex":
      return { ...state, settingsRuleIndex: action.value };
    case "setTemplateDraft":
      return { ...state, templateDraft: action.value };
    case "setRuleDraft":
      return {
        ...state,
        ruleDraft: action.value,
        ruleSuggestionIndex: 0,
      };
    case "setRuleCompletion":
      return { ...state, ruleCompletion: action.value };
    case "setRuleSuggestions":
      return {
        ...state,
        ruleSuggestions: action.value,
        ruleSuggestionIndex: clamp(state.ruleSuggestionIndex, action.value.length),
      };
    case "setRuleSuggestionIndex":
      return { ...state, ruleSuggestionIndex: action.value };
    case "setOpenDraft":
      return {
        ...state,
        openDraft: action.value,
        openSuggestionIndex: 0,
      };
    case "setOpenCompletion":
      return { ...state, openCompletion: action.value };
    case "setOpenSuggestions":
      return {
        ...state,
        openSuggestions: action.value,
        openSuggestionIndex: clamp(state.openSuggestionIndex, action.value.length),
      };
    case "setOpenSuggestionIndex":
      return { ...state, openSuggestionIndex: action.value };
    case "setCreateDraft":
      return { ...state, createDraft: action.value };
    case "setBootstrapData":
      return { ...state, ...action.value };
    case "closeOpenPath":
      return {
        ...state,
        mode: "browse",
        openDraft: "",
        openCompletion: null,
        openSuggestions: [],
        openSuggestionIndex: 0,
      };
    case "closeCreate":
      return { ...state, mode: "browse", createDraft: "" };
    case "closeDelete":
      return { ...state, mode: "browse" };
    default:
      return state;
  }
}
