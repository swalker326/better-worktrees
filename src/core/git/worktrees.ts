import path from "node:path";

import type { WorktreeInfo } from "../types";
import { parseWorktreeList } from "./parseWorktreeList";
import { runGit } from "./gitClient";

export async function resolveRepoRoot(cwd: string): Promise<string> {
  const result = await runGit(["rev-parse", "--show-toplevel"], cwd);
  return result.stdout.trim();
}

export async function listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
  const worktreesResult = await runGit(["worktree", "list", "--porcelain"], repoPath);
  const worktrees = parseWorktreeList(worktreesResult.stdout, repoPath);
  const cwd = path.resolve(process.cwd());

  return worktrees.map((worktree) => ({
    ...worktree,
    isCurrent: (() => {
      const resolvedPath = path.resolve(worktree.path);
      return cwd === resolvedPath || cwd.startsWith(`${resolvedPath}${path.sep}`);
    })(),
  }));
}

export async function branchExists(
  repoPath: string,
  branchName: string,
): Promise<boolean> {
  try {
    await runGit(["show-ref", "--verify", `refs/heads/${branchName}`], repoPath);
    return true;
  } catch {
    return false;
  }
}

export async function createWorktree(
  repoPath: string,
  worktreePath: string,
  branch: string,
  base?: string,
): Promise<void> {
  const exists = await branchExists(repoPath, branch);
  if (exists) {
    await runGit(["worktree", "add", worktreePath, branch], repoPath);
    return;
  }

  if (!base) {
    await runGit(["worktree", "add", "-b", branch, worktreePath], repoPath);
    return;
  }

  await runGit(["worktree", "add", "-b", branch, worktreePath, base], repoPath);
}

export async function deleteWorktree(
  repoPath: string,
  worktreePath: string,
  force = false,
): Promise<void> {
  const args = ["worktree", "remove"];
  if (force) {
    args.push("--force");
  }
  args.push(worktreePath);
  await runGit(args, repoPath);
}
