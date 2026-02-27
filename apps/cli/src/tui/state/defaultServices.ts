import { resolveRepoRoot } from "../../core/git/worktrees";
import {
  addRepo,
  getRepoSettings,
  hasSavedRepo,
  listRepos,
  removeRepo,
  setLastRepo,
  updateRepoSettings,
} from "../../core/services/repoService";
import { createWorktree, deleteWorktree, getWorktrees } from "../../core/services/worktreeService";
import { getPathSuggestions } from "../openPathAutocomplete";
import type { TuiServiceDeps } from "./effects";

export function createDefaultServices(): TuiServiceDeps {
  return {
    resolveRepoRoot,
    listRepos,
    getWorktrees,
    getRepoSettings,
    hasSavedRepo,
    setLastRepo,
    addRepo,
    removeRepo,
    createWorktree,
    deleteWorktree,
    updateRepoSettings,
    getPathSuggestions,
  };
}
