export type CopyRule = {
  from: string;
  to?: string;
  overwrite?: boolean;
  required?: boolean;
};

export type RepoSettings = {
  name?: string;
  defaultBase?: string;
  worktreeRoot?: string;
  nameTemplate?: string;
  copyAfterCreate?: CopyRule[];
};

export type BwtConfig = {
  version: 1;
  lastRepo?: string;
  repoOrder: string[];
  repos: Record<string, RepoSettings>;
};

export type WorktreeInfo = {
  path: string;
  head: string;
  branch: string | null;
  bare: boolean;
  detached: boolean;
  prunable: boolean;
  locked: boolean;
  isCurrent: boolean;
  isMain: boolean;
};

export type CreateWorktreeInput = {
  repoPath: string;
  name: string;
  branch?: string;
  base?: string;
  path?: string;
};

export type DeleteWorktreeInput = {
  repoPath: string;
  target: string;
  force?: boolean;
};

export type CreateWorktreeResult = {
  worktreePath: string;
  branch: string;
  copied: string[];
  warnings: string[];
};
