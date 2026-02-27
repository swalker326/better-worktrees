import path from "node:path";

import type { WorktreeInfo } from "../types";

function branchRefToName(ref: string): string {
  if (ref.startsWith("refs/heads/")) {
    return ref.replace("refs/heads/", "");
  }
  return ref;
}

export function parseWorktreeList(output: string, repoPath: string): WorktreeInfo[] {
  const lines = output.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) {
    blocks.push(current);
  }

  const parsed: WorktreeInfo[] = [];

  for (const block of blocks) {
    let wtPath = "";
    let head = "";
    let branch: string | null = null;
    let bare = false;
    let detached = false;
    let prunable = false;
    let locked = false;

    for (const line of block) {
      if (line.startsWith("worktree ")) {
        wtPath = line.slice("worktree ".length);
      } else if (line.startsWith("HEAD ")) {
        head = line.slice("HEAD ".length);
      } else if (line.startsWith("branch ")) {
        branch = branchRefToName(line.slice("branch ".length));
      } else if (line.startsWith("bare")) {
        bare = true;
      } else if (line.startsWith("detached")) {
        detached = true;
      } else if (line.startsWith("prunable")) {
        prunable = true;
      } else if (line.startsWith("locked")) {
        locked = true;
      }
    }

    if (!wtPath) {
      continue;
    }

    parsed.push({
      path: wtPath,
      head,
      branch,
      bare,
      detached,
      prunable,
      locked,
      isCurrent: false,
      isMain: path.resolve(wtPath) === path.resolve(repoPath),
    });
  }

  return parsed;
}
