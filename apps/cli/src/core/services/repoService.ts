import path from "node:path";

import { ValidationError } from "../errors";
import { loadConfig, saveConfig, upsertRepo } from "../config/configStore";
import { ensureRepoDefaults } from "../config/schema";
import { resolveRepoRoot } from "../git/worktrees";
import type { RepoSettings } from "../types";

export async function addRepo(
  repoPath: string,
  settings: RepoSettings = {},
): Promise<string> {
  const root = await resolveRepoRoot(repoPath);
  const config = await loadConfig();
  const name = settings.name ?? path.basename(root);
  const next = upsertRepo(config, root, { ...settings, name });
  await saveConfig(next);
  return root;
}

export async function removeRepo(repoPath: string): Promise<void> {
  const config = await loadConfig();
  if (!config.repos[repoPath]) {
    throw new ValidationError(`Repo is not saved: ${repoPath}`);
  }

  const repos = { ...config.repos };
  delete repos[repoPath];

  const repoOrder = config.repoOrder.filter((item) => item !== repoPath);
  const lastRepo = config.lastRepo === repoPath ? repoOrder[0] : config.lastRepo;

  await saveConfig({ ...config, repos, repoOrder, lastRepo });
}

export async function listRepos(): Promise<Array<{ path: string; name: string }>> {
  const config = await loadConfig();
  const ordered = config.repoOrder.filter((repoPath) => repoPath in config.repos);

  return ordered.map((repoPath) => ({
    path: repoPath,
    name: config.repos[repoPath]?.name ?? path.basename(repoPath),
  }));
}

export async function setLastRepo(repoPath: string): Promise<void> {
  const config = await loadConfig();
  if (!config.repos[repoPath]) {
    throw new ValidationError(`Repo is not saved: ${repoPath}`);
  }
  await saveConfig({ ...config, lastRepo: repoPath });
}

export async function getRepoSettings(repoPath: string): Promise<RepoSettings> {
  const config = await loadConfig();
  return ensureRepoDefaults(config.repos[repoPath] ?? {});
}

export async function hasSavedRepo(repoPath: string): Promise<boolean> {
  const config = await loadConfig();
  return Boolean(config.repos[repoPath]);
}

export async function updateRepoSettings(
  repoPath: string,
  settings: Partial<RepoSettings>,
): Promise<void> {
  const config = await loadConfig();
  if (!config.repos[repoPath]) {
    throw new ValidationError(`Repo is not saved: ${repoPath}`);
  }

  const next = upsertRepo(config, repoPath, {
    ...config.repos[repoPath],
    ...settings,
  });
  await saveConfig(next);
}
