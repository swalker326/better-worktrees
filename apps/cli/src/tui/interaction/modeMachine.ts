import type { AppState, Mode } from "../state/types";

export function canEnterMode(mode: Mode, state: AppState): boolean {
  if (mode === "settingsBrowse" || mode === "settingsEditRule") {
    return Boolean(state.activeRepoPath);
  }

  if (mode === "createWorktree") {
    return Boolean(state.activeRepoPath);
  }

  if (mode === "confirmDelete") {
    const selected = state.worktrees[state.worktreeIndex];
    return Boolean(selected && !selected.isMain && state.activeRepoPath);
  }

  return true;
}
