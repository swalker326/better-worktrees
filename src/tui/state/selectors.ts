import path from "node:path";

import type { Mode, Pane, RepoItem, SavedRepo } from "./types";

export function clamp(index: number, size: number): number {
  if (size <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(size - 1, index));
}

export function nextIndex(index: number, size: number): number {
  if (size <= 0) {
    return 0;
  }
  return (index + 1) % size;
}

export function prevIndex(index: number, size: number): number {
  if (size <= 0) {
    return 0;
  }
  return (index - 1 + size) % size;
}

export function deriveAllRepos(savedRepos: SavedRepo[], openedRepoPaths: string[]): RepoItem[] {
  const saved = savedRepos.map((repo) => ({ ...repo, saved: true }));
  const savedSet = new Set(saved.map((repo) => repo.path));
  const opened = openedRepoPaths
    .filter((repoPath) => !savedSet.has(repoPath))
    .map((repoPath) => ({ path: repoPath, name: path.basename(repoPath), saved: false }));
  return [...saved, ...opened];
}

export function getModeLabel(mode: Mode, pane: Pane): string {
  if (mode === "browse") {
    return pane === "repos" ? "BROWSE REPOSITORIES" : "BROWSE WORKTREES";
  }

  if (mode === "settingsBrowse") {
    return "SETTINGS";
  }

  if (mode === "settingsEditRule") {
    return "SETTINGS COPY RULE";
  }

  if (mode === "openPath") {
    return "OPEN PATH";
  }

  if (mode === "createWorktree") {
    return "CREATE WORKTREE";
  }

  return "CONFIRM DELETE";
}

export function getHelpText(mode: Mode, pane: Pane): string {
  if (mode === "openPath") {
    return "Type path  Tab accept/advance  Up/Down pick child directory  Enter open";
  }
  if (mode === "createWorktree") {
    return "Type branch  Enter create  Esc close";
  }
  if (mode === "confirmDelete") {
    return "Enter/Y delete  Esc/N close";
  }
  if (mode === "settingsBrowse") {
    return "Up/Down rule  Enter/A add rule  Delete remove  Esc close";
  }
  if (mode === "settingsEditRule") {
    return "Type file path  Tab autocomplete  Up/Down pick  Enter add file  Esc back";
  }

  const paneHint = pane === "repos" ? "Enter open" : "C create  X delete";
  return `Tab pane  Up/Down move  ${paneHint}  O path  P settings  R refresh  M save  U unsave  Q quit`;
}

export function isSettingsMode(mode: Mode): boolean {
  return mode === "settingsBrowse" || mode === "settingsEditRule";
}
