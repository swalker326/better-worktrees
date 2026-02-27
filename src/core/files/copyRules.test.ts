import { describe, expect, it } from "bun:test";

import { resolveNameTemplate } from "./copyRules";

describe("resolveNameTemplate", () => {
  it("builds BWT naming pattern", () => {
    const value = resolveNameTemplate(
      "BWT_<project_name>_wt_<branch_name>",
      "better-worktree",
      "feature/cool-branch",
    );
    expect(value).toBe("BWT_better-worktree_wt_feature_cool-branch");
  });
});
