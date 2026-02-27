import { describe, expect, it } from "bun:test";

import { createTuiEffects } from "./effects";

describe("createTuiEffects", () => {
  it("loads repo context and computes repo index", async () => {
    const effects = createTuiEffects({
      resolveRepoRoot: async () => "/repo/b",
      listRepos: async () => [{ path: "/repo/a", name: "a" }],
      getWorktrees: async () => [],
      getRepoSettings: async () => ({ copyAfterCreate: [] }),
      hasSavedRepo: async () => false,
      setLastRepo: async () => {},
      addRepo: async () => "/repo/b",
      removeRepo: async () => {},
      createWorktree: async () => ({ worktreePath: "/repo/b/feature", branch: "feature", copied: [], warnings: [] }),
      deleteWorktree: async () => "/repo/b/feature",
      updateRepoSettings: async () => {},
      getPathSuggestions: async () => ({ completion: null, suggestions: [] }),
    });

    const context = await effects.loadRepoContext(".", false, ["/repo/b"]);
    expect(context.activeRepoPath).toBe("/repo/b");
    expect(context.repoIndex).toBe(1);
  });

  it("bootstraps with fallback when cwd is not repo", async () => {
    const effects = createTuiEffects({
      resolveRepoRoot: async (input: string) => {
        if (input === process.cwd()) {
          throw new Error("not repo");
        }
        return "/repo/a";
      },
      listRepos: async () => [{ path: "/repo/a", name: "a" }],
      getWorktrees: async () => [],
      getRepoSettings: async () => ({ copyAfterCreate: [] }),
      hasSavedRepo: async () => true,
      setLastRepo: async () => {},
      addRepo: async () => "/repo/a",
      removeRepo: async () => {},
      createWorktree: async () => ({ worktreePath: "/repo/a/feature", branch: "feature", copied: [], warnings: [] }),
      deleteWorktree: async () => "/repo/a/feature",
      updateRepoSettings: async () => {},
      getPathSuggestions: async () => ({ completion: null, suggestions: [] }),
    });

    const boot = await effects.bootstrap(process.cwd());
    expect(boot.status).toBe("Loaded first saved repository");
    expect(boot.context?.activeRepoPath).toBe("/repo/a");
  });
});
