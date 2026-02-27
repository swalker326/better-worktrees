import { describe, expect, it } from "bun:test";

import { canEnterMode } from "./modeMachine";
import { initialAppState } from "../state/types";

describe("modeMachine", () => {
  it("blocks settings mode without an active repo", () => {
    expect(canEnterMode("settingsBrowse", initialAppState)).toBe(false);
  });

  it("allows delete confirmation only for non-main selected worktree", () => {
    const state = {
      ...initialAppState,
      activeRepoPath: "/repo",
      worktreeIndex: 0,
      worktrees: [
        {
          path: "/repo",
          head: "abc",
          branch: "main",
          bare: false,
          detached: false,
          prunable: false,
          locked: false,
          isCurrent: true,
          isMain: true,
        },
      ],
    };

    expect(canEnterMode("confirmDelete", state)).toBe(false);
    expect(
      canEnterMode("confirmDelete", {
        ...state,
        worktrees: [
          {
            path: "/repo/feature",
            head: "def",
            branch: "feature",
            bare: false,
            detached: false,
            prunable: false,
            locked: false,
            isCurrent: false,
            isMain: false,
          },
        ],
      }),
    ).toBe(true);
  });
});
