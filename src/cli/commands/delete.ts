import { deleteWorktree, resolveRepo } from "../../core/services/worktreeService";
import { confirm } from "../prompt";

export async function runDeleteCommand(input: {
  target: string;
  repo?: string;
  force?: boolean;
  yes?: boolean;
}) {
  const { repoPath } = await resolveRepo(input.repo);
  if (!input.yes) {
    const approved = await confirm(`Delete worktree '${input.target}'?`);
    if (!approved) {
      console.log("Cancelled.");
      return;
    }
  }

  const removed = await deleteWorktree({
    repoPath,
    target: input.target,
    force: input.force,
  });
  console.log(`Deleted worktree: ${removed}`);
}
