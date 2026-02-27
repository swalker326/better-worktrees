import type { RepoSettings, WorktreeInfo } from "../../core/types";

export type Pane = "repos" | "worktrees";
export type Tab = "repos" | "worktrees";

export type Mode =
  | "browse"
  | "openPath"
  | "createWorktree"
  | "confirmDelete"
  | "settingsBrowse"
  | "settingsEditRule";

export type SavedRepo = { path: string; name: string };
export type RepoItem = { path: string; name: string; saved: boolean };

export type AppState = {
  busy: boolean;
  status: string;
  activeTab: Tab;
  activePane: Pane;
  mode: Mode;
  savedRepos: SavedRepo[];
  openedRepoPaths: string[];
  activeRepoPath: string | null;
  repoIndex: number;
  worktrees: WorktreeInfo[];
  worktreeIndex: number;
  repoSettings: RepoSettings | null;
  settingsRuleIndex: number;
  templateDraft: string;
  ruleDraft: string;
  ruleCompletion: string | null;
  ruleSuggestions: string[];
  ruleSuggestionIndex: number;
  openDraft: string;
  openCompletion: string | null;
  openSuggestions: string[];
  openSuggestionIndex: number;
  createDraft: string;
};

export type KeyboardKey = {
  name?: string;
  ctrl?: boolean;
};

export type Command =
  | "quit"
  | "switchPanePrev"
  | "switchPaneNext"
  | "togglePane"
  | "navigatePrev"
  | "navigateNext"
  | "activateSelection"
  | "openPath"
  | "openSettings"
  | "closeMode"
  | "refresh"
  | "saveRepo"
  | "unsaveRepo"
  | "openCreate"
  | "openDelete"
  | "deleteConfirm"
  | "editRule"
  | "removeRule"
  | "tabComplete"
  | "submit";

export const DEFAULT_TEMPLATE = "BWT_<project_name>_wt_<branch_name>";

export const initialAppState: AppState = {
  busy: false,
  status: "Open a repo path or select a saved repo to load all worktrees",
  activeTab: "repos",
  activePane: "repos",
  mode: "browse",
  savedRepos: [],
  openedRepoPaths: [],
  activeRepoPath: null,
  repoIndex: 0,
  worktrees: [],
  worktreeIndex: 0,
  repoSettings: null,
  settingsRuleIndex: 0,
  templateDraft: DEFAULT_TEMPLATE,
  ruleDraft: "",
  ruleCompletion: null,
  ruleSuggestions: [],
  ruleSuggestionIndex: 0,
  openDraft: "",
  openCompletion: null,
  openSuggestions: [],
  openSuggestionIndex: 0,
  createDraft: "",
};
