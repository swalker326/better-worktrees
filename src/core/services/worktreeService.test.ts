import { afterEach, describe, expect, it, mock } from "bun:test";

function mockedGitModule(resolveRepoRootImpl: (cwd: string) => Promise<string>) {
  return {
    parseWorktreeList: () => [],
    listWorktrees: async () => [],
    resolveRepoRoot: resolveRepoRootImpl,
    createWorktree: async () => {},
    deleteWorktree: async () => {},
  };
}

afterEach(() => {
  mock.restore();
});

describe("resolveRepo", () => {
  it("prefers cwd repo and falls back to config", async () => {
    const cwd = process.cwd();
    let cwdIsRepo = true;

    mock.module("../config/configStore", () => ({
      loadConfig: async () => ({
        version: 1,
        lastRepo: "/config/repo",
        repoOrder: ["/config/repo"],
        repos: { "/config/repo": {} },
      }),
    }));

    mock.module("../git/worktrees", () =>
      mockedGitModule(async (inputPath: string) => {
        if (inputPath === cwd) {
          if (!cwdIsRepo) {
            throw new Error("cwd not repo");
          }
          return "/cwd/repo";
        }
        if (inputPath === "/config/repo") {
          return "/config/repo";
        }
        throw new Error("unexpected path");
      }),
    );

    const { resolveRepo } = await import("./worktreeService");
    const fromCwd = await resolveRepo();
    expect(fromCwd).toEqual({ repoPath: "/cwd/repo", fromConfig: false });

    cwdIsRepo = false;
    const fromConfig = await resolveRepo();
    expect(fromConfig).toEqual({ repoPath: "/config/repo", fromConfig: true });
  });
});
