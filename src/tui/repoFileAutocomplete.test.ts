import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "bun:test";

import {
  getRepoFileSuggestions,
  isRepoFile,
  resolveRuleSubmission,
  resolveRuleTabCompletion,
} from "./repoFileAutocomplete";

describe("repoFileAutocomplete", () => {
  it("returns shallow file match before nested entries", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-repo-files-"));
    const envDir = path.join(root, ".env");
    await mkdir(envDir, { recursive: true });
    await writeFile(path.join(root, ".env.local"), "a=1\n", "utf8");
    await writeFile(path.join(envDir, "nested.txt"), "n\n", "utf8");

    try {
      const result = await getRepoFileSuggestions(root, ".env");
      expect(result.suggestions[0]).toBe(".env/");
      expect(result.suggestions).toContain(".env.local");
      expect(result.suggestions).toContain(".env/nested.txt");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("supports rule completion and submission selection", () => {
    expect(resolveRuleTabCompletion(".en", ".env.local", [".env.local"], 0)).toBe(
      ".env.local",
    );
    expect(resolveRuleSubmission("", ["a", "b"], 1)).toBe("b");
  });

  it("detects files and rejects directories", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-repo-files-check-"));
    await mkdir(path.join(root, "config"), { recursive: true });
    await writeFile(path.join(root, "config", "app.env"), "x\n", "utf8");

    try {
      expect(await isRepoFile(root, "config/app.env")).toBe(true);
      expect(await isRepoFile(root, "config")).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
