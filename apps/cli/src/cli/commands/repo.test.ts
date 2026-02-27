import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";

afterEach(() => {
  mock.restore();
});

describe("runRepoSetCopyCommand", () => {
  it("fails when repo is not saved", async () => {
    mock.module("../../core/git/worktrees", () => ({
      parseWorktreeList: () => [],
      listWorktrees: async () => [],
      createWorktree: async () => {},
      deleteWorktree: async () => {},
      resolveRepoRoot: async () => "/tmp/repo",
    }));

    mock.module("../../core/services/repoService", () => ({
      addRepo: async () => "/tmp/repo",
      listRepos: async () => [],
      removeRepo: async () => {},
      setLastRepo: async () => {},
      hasSavedRepo: async () => false,
      updateRepoSettings: async () => {},
    }));

    const { runRepoSetCopyCommand } = await import("./repo");

    await expect(
      runRepoSetCopyCommand("/tmp/repo", [{ from: ".env.local" }]),
    ).rejects.toThrow("Repo is not saved");
  });

  it("updates rules when repo is saved", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => undefined);
    const updateSpy = mock(async () => {});

    mock.module("../../core/git/worktrees", () => ({
      parseWorktreeList: () => [],
      listWorktrees: async () => [],
      createWorktree: async () => {},
      deleteWorktree: async () => {},
      resolveRepoRoot: async () => "/tmp/repo",
    }));

    mock.module("../../core/services/repoService", () => ({
      addRepo: async () => "/tmp/repo",
      listRepos: async () => [],
      removeRepo: async () => {},
      setLastRepo: async () => {},
      hasSavedRepo: async () => true,
      updateRepoSettings: updateSpy,
    }));

    const { runRepoSetCopyCommand } = await import("./repo");

    await runRepoSetCopyCommand("/tmp/repo", [{ from: ".env.local", to: ".env.local" }]);

    expect(updateSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });
});
