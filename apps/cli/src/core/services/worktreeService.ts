import path from "node:path";

import { loadConfig } from "../config/configStore";
import { resolveNameTemplate, applyCopyRules } from "../files/copyRules";
import {
  createWorktree as createGitWorktree,
  deleteWorktree as deleteGitWorktree,
  listWorktrees,
  resolveRepoRoot,
} from "../git/worktrees";
import type {
  CreateWorktreeInput,
  CreateWorktreeResult,
  DeleteWorktreeInput,
  WorktreeInfo,
} from "../types";
import { RepoResolutionError, ValidationError } from "../errors";

const DEFAULT_TEMPLATE = "BWT_<project_name>_wt_<branch_name>";

export async function resolveRepo(
  explicitRepo?: string,
): Promise<{ repoPath: string; fromConfig: boolean }> {
  if (explicitRepo) {
    return { repoPath: await resolveRepoRoot(explicitRepo), fromConfig: false };
  }

  try {
    return { repoPath: await resolveRepoRoot(process.cwd()), fromConfig: false };
  } catch {
    // continue to config fallback
  }

  const config = await loadConfig();
  if (config.lastRepo) {
    try {
      return {
        repoPath: await resolveRepoRoot(config.lastRepo),
        fromConfig: true,
      };
    } catch {
      // stale config path, fall through to error
    }
  }

  throw new RepoResolutionError(
    "Could not resolve a repository. Use -R/--repo or run from a repo/worktree directory.",
  );
}

export async function getWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
  return listWorktrees(repoPath);
}

function resolveWorktreePath(
  repoPath: string,
  branch: string,
  configuredRoot: string | undefined,
  configuredTemplate: string | undefined,
  explicitPath?: string,
): string {
  if (explicitPath) {
    return path.resolve(explicitPath);
  }

  const root = configuredRoot
    ? path.resolve(configuredRoot)
    : path.resolve(path.dirname(repoPath), `${path.basename(repoPath)}-worktrees`);

  const template = configuredTemplate ?? DEFAULT_TEMPLATE;
  const name = resolveNameTemplate(template, path.basename(repoPath), branch);
  return path.join(root, name);
}

export async function createWorktree(
  input: CreateWorktreeInput,
): Promise<CreateWorktreeResult> {
  const repoPath = await resolveRepoRoot(input.repoPath);
  const config = await loadConfig();
  const repoConfig = config.repos[repoPath];

  const branch = input.branch ?? input.name;
  if (!branch) {
    throw new ValidationError("A branch/worktree name is required");
  }

  const base = input.base ?? repoConfig?.defaultBase;
  const worktreePath = resolveWorktreePath(
    repoPath,
    branch,
    repoConfig?.worktreeRoot,
    repoConfig?.nameTemplate,
    input.path,
  );

  await createGitWorktree(repoPath, worktreePath, branch, base);

  const { copied, warnings } = await applyCopyRules(
    repoPath,
    worktreePath,
    repoConfig?.copyAfterCreate ?? [],
  );

  return {
    worktreePath,
    branch,
    copied,
    warnings,
  };
}

export async function deleteWorktree(input: DeleteWorktreeInput): Promise<string> {
  const repoPath = await resolveRepoRoot(input.repoPath);
  const worktrees = await listWorktrees(repoPath);

  const candidate = worktrees.find(
    (worktree) =>
      worktree.path === path.resolve(input.target) ||
      path.basename(worktree.path) === input.target ||
      worktree.branch === input.target,
  );

  if (!candidate) {
    throw new ValidationError(`Could not find worktree: ${input.target}`);
  }

  if (candidate.isMain) {
    throw new ValidationError("Refusing to delete the main repository worktree");
  }

  await deleteGitWorktree(repoPath, candidate.path, input.force);
  return candidate.path;
}
