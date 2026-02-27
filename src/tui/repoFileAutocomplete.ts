import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export type RepoFileSuggestionResult = {
  completion: string | null;
  suggestions: string[];
};

function startsWithCaseInsensitive(value: string, query: string): boolean {
  return value.toLowerCase().startsWith(query.toLowerCase());
}

function uniq(items: string[]): string[] {
  return [...new Set(items)];
}

function normalizeDraft(value: string): string {
  return value.trim().replace(/\\/g, "/");
}

async function listEntries(dirPath: string): Promise<Array<{ name: string; isDirectory: boolean }>> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() || entry.isFile())
    .map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function joinDraft(base: string, name: string, isDirectory: boolean): string {
  const joined = base ? `${base}/${name}` : name;
  return isDirectory ? `${joined}/` : joined;
}

export async function getRepoFileSuggestions(
  repoPath: string,
  draft: string,
  options?: { maxResults?: number },
): Promise<RepoFileSuggestionResult> {
  const maxResults = options?.maxResults ?? 12;
  const input = normalizeDraft(draft);
  const trailingSlash = input.endsWith("/");
  const dirPart = trailingSlash
    ? input.slice(0, -1)
    : input.includes("/")
      ? input.slice(0, input.lastIndexOf("/"))
      : "";
  const prefix = trailingSlash ? "" : input.includes("/") ? input.slice(input.lastIndexOf("/") + 1) : input;

  const baseDir = path.resolve(repoPath, dirPart || ".");

  try {
    const entries = await listEntries(baseDir);
    const matching = prefix
      ? entries.filter((entry) => startsWithCaseInsensitive(entry.name, prefix))
      : entries;

    const bestMatch = matching[0] ?? null;

    const shallow = matching.map((entry) => joinDraft(dirPart, entry.name, entry.isDirectory));

    const deep =
      !trailingSlash && bestMatch?.isDirectory
        ? (await listEntries(path.resolve(baseDir, bestMatch.name))).map((entry) =>
            joinDraft(
              dirPart ? `${dirPart}/${bestMatch.name}` : bestMatch.name,
              entry.name,
              entry.isDirectory,
            ),
          )
        : [];

    const completion = prefix && bestMatch
      ? joinDraft(dirPart, bestMatch.name, bestMatch.isDirectory)
      : null;

    return {
      completion,
      suggestions: uniq([...shallow, ...deep]).slice(0, maxResults),
    };
  } catch {
    return { completion: null, suggestions: [] };
  }
}

export function resolveRuleSubmission(
  draft: string,
  suggestions: string[],
  selectedSuggestionIndex: number,
): string | null {
  const typed = normalizeDraft(draft);
  const selected = suggestions[selectedSuggestionIndex] ?? suggestions[0] ?? "";
  const picked = typed || selected;
  return picked || null;
}

export function resolveRuleTabCompletion(
  draft: string,
  completion: string | null,
  suggestions: string[],
  selectedSuggestionIndex: number,
): string | null {
  const typed = normalizeDraft(draft);
  if (completion && completion !== typed) {
    return completion;
  }
  return suggestions[selectedSuggestionIndex] ?? suggestions[0] ?? null;
}

export async function isRepoFile(repoPath: string, relativePath: string): Promise<boolean> {
  const target = path.resolve(repoPath, relativePath);
  try {
    const details = await stat(target);
    return details.isFile();
  } catch {
    return false;
  }
}
