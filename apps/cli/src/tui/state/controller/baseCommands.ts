import { type Command } from "../types";
import { clamp, nextIndex, prevIndex } from "../selectors";
import type { CommandContext } from "./modeCommands";

export async function handleBaseCommand(
  command: Command,
  context: CommandContext,
): Promise<boolean | null> {
  const {
    state,
    dispatch,
    effects,
    refreshWorktrees,
    runBusyTask,
    selectedRepo,
    selectedWorktree,
    setMode,
    allRepos,
    activateRepo,
  } = context;

  if (command === "switchPanePrev") {
    dispatch({ type: "setActivePane", value: "repos" });
    return false;
  }
  if (command === "switchPaneNext") {
    dispatch({ type: "setActivePane", value: "worktrees" });
    return false;
  }
  if (command === "togglePane") {
    dispatch({
      type: "setActivePane",
      value: state.activePane === "repos" ? "worktrees" : "repos",
    });
    return false;
  }
  if (command === "openPath") {
    dispatch({ type: "setOpenDraft", value: "" });
    dispatch({ type: "setOpenCompletion", value: null });
    dispatch({ type: "setMode", value: "openPath" });
    return false;
  }
  if (command === "openSettings") {
    setMode("settingsBrowse");
    return false;
  }
  if (command === "refresh") {
    await runBusyTask(async () => {
      await refreshWorktrees();
    });
    return false;
  }
  if (command === "saveRepo") {
    if (!state.activeRepoPath) {
      dispatch({ type: "setStatus", value: "Select a repository first" });
      return false;
    }
    await runBusyTask(async () => {
      const repos = await effects.saveRepo(state.activeRepoPath!);
      dispatch({ type: "setSavedRepos", value: repos });
      dispatch({ type: "setStatus", value: "Saved active repo" });
    });
    return false;
  }
  if (command === "unsaveRepo") {
    if (!selectedRepo?.saved) {
      dispatch({ type: "setStatus", value: "Select a saved repository" });
      return false;
    }
    await runBusyTask(async () => {
      const repos = await effects.unsaveRepo(selectedRepo.path);
      dispatch({ type: "setSavedRepos", value: repos });
      dispatch({ type: "setStatus", value: "Removed saved repo" });
    });
    return false;
  }
  if (command === "openCreate") {
    setMode("createWorktree");
    return false;
  }
  if (command === "openDelete") {
    if (!selectedWorktree || selectedWorktree.isMain) {
      dispatch({ type: "setStatus", value: "Select a non-main worktree" });
      return false;
    }
    setMode("confirmDelete");
    return false;
  }
  if (command === "navigateNext") {
    if (state.activePane === "repos") {
      const index = nextIndex(state.repoIndex, allRepos.length);
      dispatch({ type: "setRepoIndex", value: index });
    } else {
      dispatch({
        type: "setWorktreeIndex",
        value: nextIndex(state.worktreeIndex, state.worktrees.length),
      });
    }
    return false;
  }
  if (command === "navigatePrev") {
    if (state.activePane === "repos") {
      const index = prevIndex(state.repoIndex, allRepos.length);
      dispatch({ type: "setRepoIndex", value: index });
    } else {
      dispatch({
        type: "setWorktreeIndex",
        value: prevIndex(state.worktreeIndex, state.worktrees.length),
      });
    }
    return false;
  }
  if (command === "activateSelection") {
    if (state.activePane !== "repos" || !selectedRepo) {
      return false;
    }
    await runBusyTask(async () => {
      await activateRepo(selectedRepo.path, selectedRepo.saved);
      dispatch({ type: "setStatus", value: "Activated selected repository" });
    });
    return false;
  }
  if (command === "quit") {
    return true;
  }

  return null;
}

export async function activateRepoFromIndex(
  index: number,
  context: Pick<
    CommandContext,
    "allRepos" | "runBusyTask" | "activateRepo" | "dispatch"
  >,
): Promise<void> {
  const candidate = context.allRepos[clamp(index, context.allRepos.length)];
  if (!candidate) {
    return;
  }
  await context.runBusyTask(async () => {
    await context.activateRepo(candidate.path, candidate.saved);
    context.dispatch({ type: "setStatus", value: "Activated selected repository" });
  });
}
