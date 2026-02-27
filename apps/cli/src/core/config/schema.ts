import type { BwtConfig, CopyRule, RepoSettings } from "../types";

const DEFAULT_TEMPLATE = "BWT_<project_name>_wt_<branch_name>";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCopyRule(value: unknown): CopyRule | null {
  if (!isObject(value) || typeof value.from !== "string") {
    return null;
  }

  return {
    from: value.from,
    to: typeof value.to === "string" ? value.to : value.from,
    overwrite: typeof value.overwrite === "boolean" ? value.overwrite : false,
    required: typeof value.required === "boolean" ? value.required : false,
  };
}

function normalizeRepoSettings(value: unknown): RepoSettings {
  if (!isObject(value)) {
    return {
      nameTemplate: DEFAULT_TEMPLATE,
      copyAfterCreate: [],
    };
  }

  const copyAfterCreate = Array.isArray(value.copyAfterCreate)
    ? value.copyAfterCreate
        .map((rule) => normalizeCopyRule(rule))
        .filter((rule): rule is CopyRule => rule !== null)
    : [];

  return {
    name: typeof value.name === "string" ? value.name : undefined,
    defaultBase:
      typeof value.defaultBase === "string" ? value.defaultBase : undefined,
    worktreeRoot:
      typeof value.worktreeRoot === "string" ? value.worktreeRoot : undefined,
    nameTemplate:
      typeof value.nameTemplate === "string"
        ? value.nameTemplate
        : DEFAULT_TEMPLATE,
    copyAfterCreate,
  };
}

export function defaultConfig(): BwtConfig {
  return {
    version: 1,
    repoOrder: [],
    repos: {},
  };
}

export function normalizeConfig(raw: unknown): BwtConfig {
  if (!isObject(raw)) {
    return defaultConfig();
  }

  const reposRaw = isObject(raw.repos) ? raw.repos : {};
  const repos: Record<string, RepoSettings> = {};

  for (const [repoPath, repoSettings] of Object.entries(reposRaw)) {
    repos[repoPath] = normalizeRepoSettings(repoSettings);
  }

  const repoOrder = Array.isArray(raw.repoOrder)
    ? Array.from(
        new Set(
          raw.repoOrder.filter(
            (item): item is string => typeof item === "string" && item.trim().length > 0,
          ),
        ),
      )
    : [];

  return {
    version: 1,
    lastRepo: typeof raw.lastRepo === "string" ? raw.lastRepo : undefined,
    repoOrder,
    repos,
  };
}

export function ensureRepoDefaults(repo: RepoSettings): RepoSettings {
  return {
    ...repo,
    nameTemplate: repo.nameTemplate ?? DEFAULT_TEMPLATE,
    copyAfterCreate: repo.copyAfterCreate ?? [],
  };
}
