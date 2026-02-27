import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ConfigError } from "../errors";
import type { BwtConfig, RepoSettings } from "../types";
import { defaultConfig, ensureRepoDefaults, normalizeConfig } from "./schema";

const CONFIG_DIR = path.join(os.homedir(), ".config", "bwt");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<BwtConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    return normalizeConfig(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return defaultConfig();
    }

    if (error instanceof SyntaxError) {
      throw new ConfigError(
        "Could not parse ~/.config/bwt/config.json",
        error.message,
      );
    }

    throw new ConfigError("Failed to load configuration", String(error));
  }
}

export async function saveConfig(config: BwtConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export function upsertRepo(
  config: BwtConfig,
  repoPath: string,
  repoSettings: RepoSettings,
): BwtConfig {
  const merged: BwtConfig = {
    ...config,
    repos: {
      ...config.repos,
      [repoPath]: ensureRepoDefaults({
        ...config.repos[repoPath],
        ...repoSettings,
      }),
    },
    repoOrder: config.repoOrder.includes(repoPath)
      ? config.repoOrder
      : [...config.repoOrder, repoPath],
  };

  if (!merged.lastRepo) {
    merged.lastRepo = repoPath;
  }

  return merged;
}
