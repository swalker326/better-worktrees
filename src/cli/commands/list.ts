import { getWorktrees, resolveRepo } from "../../core/services/worktreeService";
import { printJson, printWorktrees } from "../output";

export async function runListCommand(options: { repo?: string; json?: boolean }) {
  const { repoPath } = await resolveRepo(options.repo);
  const worktrees = await getWorktrees(repoPath);
  if (options.json) {
    printJson(worktrees);
    return;
  }
  printWorktrees(worktrees);
}
