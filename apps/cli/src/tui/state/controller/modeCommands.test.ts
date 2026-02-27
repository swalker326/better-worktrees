import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "bun:test";

import type { createTuiEffects } from "../effects";
import { initialAppState } from "../types";
import { handleModeCommand, type CommandContext } from "./modeCommands";

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

describe("handleModeCommand", () => {
  it("validates open path submission before running task", async () => {
    const actions: Array<{ type: string; value?: unknown }> = [];
    let busyTaskCalled = false;

    const context = createContext({
      state: { ...initialAppState, mode: "openPath" },
      dispatch: (action) => actions.push(action as { type: string; value?: unknown }),
      runBusyTask: async () => {
        busyTaskCalled = true;
      },
    });

    const result = await handleModeCommand("submit", context);

    expect(result).toBe(false);
    expect(busyTaskCalled).toBe(false);
    expect(actions).toContainEqual({ type: "setStatus", value: "Path is required" });
  });

  it("rejects file paths for open path submission", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-open-path-file-"));
    const filePath = path.join(root, "README.md");
    await writeFile(filePath, "hi\n", "utf8");

    const actions: Array<{ type: string; value?: unknown }> = [];

    try {
      const context = createContext({
        state: { ...initialAppState, mode: "openPath", openDraft: filePath },
        dispatch: (action) => actions.push(action as { type: string; value?: unknown }),
      });

      const result = await handleModeCommand("submit", context);

      expect(result).toBe(false);
      expect(actions).toContainEqual({
        type: "setStatus",
        value: "Path must be a directory",
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rejects directory selection when adding copy file rule", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-settings-rule-dir-"));
    const nestedDir = path.join(root, "config");
    await writeFile(path.join(root, ".env.local"), "x\n", "utf8");
    await mkdir(nestedDir, { recursive: true });

    const actions: Array<{ type: string; value?: unknown }> = [];

    try {
      const context = createContext({
        state: {
          ...initialAppState,
          mode: "settingsEditRule",
          activeRepoPath: root,
          ruleDraft: "config/",
          repoSettings: { copyAfterCreate: [] },
        },
        dispatch: (action) => actions.push(action as { type: string; value?: unknown }),
      });

      const result = await handleModeCommand("submit", context);

      expect(result).toBe(false);
      expect(actions).toContainEqual({
        type: "setStatus",
        value: "Select a file (directories are for navigation)",
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
