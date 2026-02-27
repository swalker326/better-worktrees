import { describe, expect, it } from "bun:test";

import { parseWorktreeList } from "./parseWorktreeList";

describe("parseWorktreeList", () => {
  it("parses porcelain output into normalized worktree entries", () => {
    const output = [
      "worktree /repos/main",
      "HEAD 1111111",
      "branch refs/heads/main",
      "",
      "worktree /repos/main/BWT_repo_wt_feature_x",
      "HEAD 2222222",
      "branch refs/heads/feature/x",
      "locked",
      "",
      "worktree /repos/main/BWT_repo_wt_detached",
      "HEAD 3333333",
      "detached",
      "prunable",
      "",
    ].join("\n");

    const result = parseWorktreeList(output, "/repos/main");

    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject({
      path: "/repos/main",
      branch: "main",
      isMain: true,
      detached: false,
      locked: false,
      prunable: false,
    });

    expect(result[1]).toMatchObject({
      path: "/repos/main/BWT_repo_wt_feature_x",
      branch: "feature/x",
      isMain: false,
      detached: false,
      locked: true,
      prunable: false,
    });

    expect(result[2]).toMatchObject({
      path: "/repos/main/BWT_repo_wt_detached",
      branch: null,
      isMain: false,
      detached: true,
      prunable: true,
    });
  });
});
