import { describe, expect, it } from "bun:test";

import { appReducer } from "./reducer";
import { initialAppState } from "./types";

describe("appReducer", () => {
  it("clamps worktree index when worktrees change", () => {
    const withIndex = { ...initialAppState, worktreeIndex: 4 };
    const next = appReducer(withIndex, {
      type: "setWorktrees",
      value: [
        {
          path: "/tmp/wt",
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
    });

    expect(next.worktreeIndex).toBe(0);
  });

  it("resets open path state when closing", () => {
    const openState = {
      ...initialAppState,
      mode: "openPath" as const,
      openDraft: "~/repo",
      openCompletion: "~/repo",
      openSuggestions: ["~/repo"],
      openSuggestionIndex: 1,
    };

    const next = appReducer(openState, { type: "closeOpenPath" });
    expect(next.mode).toBe("browse");
    expect(next.openDraft).toBe("");
    expect(next.openCompletion).toBeNull();
    expect(next.openSuggestions).toEqual([]);
    expect(next.openSuggestionIndex).toBe(0);
  });
});
