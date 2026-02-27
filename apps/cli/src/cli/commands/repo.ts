import { resolveRepoRoot } from "../../core/git/worktrees";
import {
  addRepo,
  hasSavedRepo,
  listRepos,
  removeRepo,
  setLastRepo,
  updateRepoSettings,
} from "../../core/services/repoService";

export async function runRepoListCommand() {
  const repos = await listRepos();
  if (repos.length === 0) {
    console.log("No saved repos. Add one with `bwt repo add <path>`.");
    return;
  }

  for (const repo of repos) {
    console.log(`${repo.name}  ${repo.path}`);
  }
}

export async function runRepoAddCommand(pathArg: string, alias?: string) {
  const saved = await addRepo(pathArg, alias ? { name: alias } : {});
  console.log(`Saved repo: ${saved}`);
}

export async function runRepoRemoveCommand(pathArg: string) {
  const root = await resolveRepoRoot(pathArg);
  await removeRepo(root);
  console.log(`Removed repo: ${root}`);
}

export async function runRepoUseCommand(pathArg: string) {
  const root = await resolveRepoRoot(pathArg);
  await setLastRepo(root);
  console.log(`Active repo: ${root}`);
}

export async function runRepoSetCopyCommand(
  pathArg: string,
  rules: Array<{ from: string; to?: string; overwrite?: boolean; required?: boolean }>,
) {
  const root = await resolveRepoRoot(pathArg);
  if (!(await hasSavedRepo(root))) {
    throw new Error(`Repo is not saved: ${root}. Run 'bwt repo add ${root}' first.`);
  }
  await updateRepoSettings(root, { copyAfterCreate: rules });
  console.log(`Updated copy rules for: ${root}`);
}
