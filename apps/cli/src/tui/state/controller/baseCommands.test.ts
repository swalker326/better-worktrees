import { describe, expect, it } from "bun:test";

import type { createTuiEffects } from "../effects";
import { initialAppState } from "../types";
import { activateRepoFromIndex, handleBaseCommand } from "./baseCommands";
import type { CommandContext } from "./modeCommands";

function createEffectsMock(): ReturnType<typeof createTuiEffects> {
  return {
    loadRepoContext: async () => ({
      activeRepoPath: "/repo",
      openedRepoPaths: ["/repo"],
      savedRepos: [],
      repoIndex: 0,
      worktrees: [],
      repoSettings: { copyAfterCreate: [] },
      templateDraft: "BWT_<project_name>_wt_<branch_name>",
    }),
    bootstrap: async () => ({ repos: [], context: null, status: "" }),
    refreshSavedRepos: async () => [],
    refreshWorktreeList: async () => [],
    saveRepo: async () => [],
    unsaveRepo: async () => [],
    createRepoWorktree: async () => [],
    deleteRepoWorktree: async () => [],
    saveSettings: async () => ({ copyAfterCreate: [] }),
    loadOpenPathSuggestions: async () => ({ completion: null, suggestions: [] }),
  };
}

function createContext(overrides: Partial<CommandContext> = {}): CommandContext {
  return {
    state: initialAppState,
    dispatch: () => {},
    effects: createEffectsMock(),
    selectedRepo: null,
    selectedWorktree: null,
    runBusyTask: async (task) => {
      await task();
    },
    activateRepo: async () => {},
    setMode: () => {},
    refreshWorktrees: async () => {},
    allRepos: [],
    ...overrides,
  };
}

describe("handleBaseCommand", () => {
  it("toggles active pane", async () => {
    const actions: Array<{ type: string; value?: unknown }> = [];

    const context = createContext({
      state: { ...initialAppState, activePane: "repos" },
      dispatch: (action) => actions.push(action as { type: string; value?: unknown }),
    });

    const result = await handleBaseCommand("togglePane", context);

    expect(result).toBe(false);
    expect(actions).toContainEqual({ type: "setActivePane", value: "worktrees" });
  });
});

describe("activateRepoFromIndex", () => {
  it("clamps index and activates selected repo", async () => {
    const activated: string[] = [];

    await activateRepoFromIndex(9, {
      allRepos: [{ path: "/repo/a", name: "a", saved: true }],
      runBusyTask: async (task) => {
        await task();
      },
      activateRepo: async (path) => {
        activated.push(path);
      },
      dispatch: () => {},
    });

    expect(activated).toEqual(["/repo/a"]);
  });
});
