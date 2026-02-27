import type { WorktreeInfo } from "../core/types";

export function printWorktrees(worktrees: WorktreeInfo[]): void {
  if (worktrees.length === 0) {
    console.log("No worktrees found.");
    return;
  }

  const rows = worktrees.map((worktree) => {
    const branch = worktree.branch ?? "(detached)";
    const current = worktree.isCurrent ? "*" : " ";
    const kind = worktree.isMain ? "main" : "wt";
    return `${current} ${kind.padEnd(4)} ${branch.padEnd(24)} ${worktree.path}`;
  });

  console.log("  kind branch                   path");
  for (const row of rows) {
    console.log(row);
  }
}

export function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}
