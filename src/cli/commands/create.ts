import { createWorktree, resolveRepo } from "../../core/services/worktreeService";
import { printJson } from "../output";

export async function runCreateCommand(input: {
  name: string;
  repo?: string;
  branch?: string;
  base?: string;
  path?: string;
  json?: boolean;
}) {
  const { repoPath } = await resolveRepo(input.repo);
  const result = await createWorktree({
    repoPath,
    name: input.name,
    branch: input.branch,
    base: input.base,
    path: input.path,
  });

  if (input.json) {
    printJson(result);
    return;
  }

  console.log(`Created worktree: ${result.worktreePath}`);
  if (result.copied.length > 0) {
    console.log("Copied files:");
    for (const copied of result.copied) {
      console.log(`- ${copied}`);
    }
  }
  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }
}
