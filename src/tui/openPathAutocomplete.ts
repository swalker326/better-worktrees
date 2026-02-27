import { readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { collapseHome } from "./pathDisplay";

export type OpenPathSuggestionResult = {
  completion: string | null;
  suggestions: string[];
};

export function expandHome(input: string, homeDir = os.homedir()): string {
  if (input === "~") {
    return homeDir;
  }
  if (input.startsWith("~/")) {
    return path.join(homeDir, input.slice(2));
  }
  return input;
}

function startsWithCaseInsensitive(value: string, query: string): boolean {
  return value.toLowerCase().startsWith(query.toLowerCase());
}

function uniq(items: string[]): string[] {
  return [...new Set(items)];
}

async function listDirectories(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function resolveContext(input: string, homeDir: string): {
  raw: string;
  resolved: string;
  baseDir: string;
  prefix: string;
  trailingSlash: boolean;
} {
  const raw = input.trim();
  const trailingSlash = /[\\/]$/.test(raw);
  const expanded = expandHome(raw, homeDir);
  const resolved = expanded ? path.resolve(expanded) : homeDir;
  const baseDir = trailingSlash ? resolved : path.dirname(resolved);
  const prefix = trailingSlash ? "" : path.basename(resolved);
  return { raw, resolved, baseDir, prefix, trailingSlash };
}

export async function getPathSuggestions(
  input: string,
  options?: { homeDir?: string; maxResults?: number },
): Promise<OpenPathSuggestionResult> {
  const homeDir = options?.homeDir ?? os.homedir();
  const maxResults = options?.maxResults ?? 8;
  const { raw, resolved, baseDir, prefix, trailingSlash } = resolveContext(input, homeDir);

  if (!raw) {
    try {
      const homeChildren = await listDirectories(homeDir);
      return {
        completion: null,
        suggestions: homeChildren
          .slice(0, maxResults)
          .map((name) => collapseHome(path.join(homeDir, name), homeDir)),
      };
    } catch {
      return { completion: null, suggestions: [] };
    }
  }

  try {
    const baseChildren = await listDirectories(baseDir);
    const matchingChildren = prefix
      ? baseChildren.filter((name) => startsWithCaseInsensitive(name, prefix))
      : baseChildren;
    const bestMatch = matchingChildren[0] ?? null;

    const completion = prefix && bestMatch
      ? collapseHome(path.join(baseDir, bestMatch), homeDir)
      : trailingSlash
        ? collapseHome(resolved, homeDir)
        : null;

    const shallowSuggestions = matchingChildren.map((name) =>
      collapseHome(path.join(baseDir, name), homeDir),
    );

    const deepSuggestions =
      !trailingSlash && bestMatch
        ? (await listDirectories(path.join(baseDir, bestMatch))).map((name) =>
            collapseHome(path.join(baseDir, bestMatch, name), homeDir),
          )
        : [];

    return {
      completion,
      suggestions: uniq([...shallowSuggestions, ...deepSuggestions]).slice(
        0,
        maxResults,
      ),
    };
  } catch {
    return { completion: null, suggestions: [] };
  }
}

export function resolveOpenPathSubmission(
  draft: string,
  suggestions: string[],
  selectedSuggestionIndex: number,
  homeDir = os.homedir(),
): string | null {
  const typed = draft.trim();
  const chosen = suggestions[selectedSuggestionIndex] ?? suggestions[0];
  const picked = typed || chosen;
  if (!picked) {
    return null;
  }
  return expandHome(picked, homeDir);
}

export function resolveTabCompletion(
  draft: string,
  completion: string | null,
  suggestions: string[],
  selectedSuggestionIndex: number,
): string | null {
  const typed = draft.trim();
  if (completion && completion !== typed) {
    return completion;
  }
  return suggestions[selectedSuggestionIndex] ?? suggestions[0] ?? null;
}
