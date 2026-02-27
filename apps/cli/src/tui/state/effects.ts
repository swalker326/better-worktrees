import type { RepoSettings, WorktreeInfo } from "../../core/types";
import type { OpenPathSuggestionResult } from "../openPathAutocomplete";
import { DEFAULT_TEMPLATE } from "./types";

type RepoList = Array<{ path: string; name: string }>;

export type TuiServiceDeps = {
  resolveRepoRoot: (repoPath: string) => Promise<string>;
  listRepos: () => Promise<RepoList>;
  getWorktrees: (repoPath: string) => Promise<WorktreeInfo[]>;
  getRepoSettings: (repoPath: string) => Promise<RepoSettings>;
  hasSavedRepo: (repoPath: string) => Promise<boolean>;
  setLastRepo: (repoPath: string) => Promise<void>;
  addRepo: (repoPath: string) => Promise<string>;
  removeRepo: (repoPath: string) => Promise<void>;
  createWorktree: (input: {
    repoPath: string;
    name: string;
    branch: string;
  }) => Promise<unknown>;
  deleteWorktree: (input: { repoPath: string; target: string }) => Promise<string>;
  updateRepoSettings: (
    repoPath: string,
    settings: Pick<RepoSettings, "nameTemplate" | "copyAfterCreate">,
  ) => Promise<void>;
  getPathSuggestions: (draft: string) => Promise<OpenPathSuggestionResult>;
};

export function createTuiEffects(services: TuiServiceDeps) {
  async function loadRepoContext(repoPath: string, persist = false, openedRepoPaths: string[] = []) {
    const root = await services.resolveRepoRoot(repoPath);
    const savedRepos = await services.listRepos();
    const worktrees = await services.getWorktrees(root);
    const repoSettings = await services.getRepoSettings(root);
    const opened = openedRepoPaths.includes(root) ? openedRepoPaths : [...openedRepoPaths, root];

    const repoPathOrder = [...new Set([...savedRepos.map((repo) => repo.path), ...opened])];
    const repoIndex = Math.max(0, repoPathOrder.findIndex((item) => item === root));

    if (persist && (await services.hasSavedRepo(root))) {
      await services.setLastRepo(root);
    }

    return {
      activeRepoPath: root,
      openedRepoPaths: opened,
      savedRepos,
      repoIndex,
      worktrees,
      repoSettings,
      templateDraft: repoSettings.nameTemplate ?? DEFAULT_TEMPLATE,
    };
  }

  async function bootstrap(cwd: string): Promise<{ repos: RepoList; context: Awaited<ReturnType<typeof loadRepoContext>> | null; status: string }> {
    const repos = await services.listRepos();
    try {
      const context = await loadRepoContext(cwd, false, repos.map((repo) => repo.path));
      return { repos, context, status: "Loaded current repository context" };
    } catch {
      if (!repos[0]) {
        return { repos, context: null, status: "Open a repo path or select a saved repo" };
      }

      const context = await loadRepoContext(repos[0].path, true, repos.map((repo) => repo.path));
      return { repos, context, status: "Loaded first saved repository" };
    }
  }

  async function refreshSavedRepos(): Promise<RepoList> {
    return services.listRepos();
  }

  async function refreshWorktreeList(repoPath: string) {
    return services.getWorktrees(repoPath);
  }

  async function saveRepo(repoPath: string): Promise<RepoList> {
    await services.addRepo(repoPath);
    return services.listRepos();
  }

  async function unsaveRepo(repoPath: string): Promise<RepoList> {
    await services.removeRepo(repoPath);
    return services.listRepos();
  }

  async function createRepoWorktree(repoPath: string, branch: string) {
    await services.createWorktree({ repoPath, name: branch, branch });
    return services.getWorktrees(repoPath);
  }

  async function deleteRepoWorktree(repoPath: string, target: string) {
    await services.deleteWorktree({ repoPath, target });
    return services.getWorktrees(repoPath);
  }

  async function saveSettings(
    repoPath: string,
    settings: Pick<RepoSettings, "nameTemplate" | "copyAfterCreate">,
  ) {
    await services.updateRepoSettings(repoPath, settings);
    return services.getRepoSettings(repoPath);
  }

  async function loadOpenPathSuggestions(draft: string) {
    return services.getPathSuggestions(draft);
  }

  return {
    loadRepoContext,
    bootstrap,
    refreshSavedRepos,
    refreshWorktreeList,
    saveRepo,
    unsaveRepo,
    createRepoWorktree,
    deleteRepoWorktree,
    saveSettings,
    loadOpenPathSuggestions,
  };
}
