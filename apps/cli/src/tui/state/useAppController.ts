import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { formatError } from "../../core/errors";
import { canEnterMode } from "../interaction/modeMachine";
import { routeKey } from "../keyboard/routeKey";
import { getRepoFileSuggestions } from "../repoFileAutocomplete";
import { activateRepoFromIndex, handleBaseCommand } from "./controller/baseCommands";
import { handleModeCommand } from "./controller/modeCommands";
import { createDefaultServices } from "./defaultServices";
import { createTuiEffects } from "./effects";
import { appReducer } from "./reducer";
import {
	clamp,
	deriveAllRepos,
	getHelpText,
	getModeLabel,
} from "./selectors";
import {
	type Command,
	initialAppState,
	type Mode,
} from "./types";

export function useAppController() {
	const [state, dispatch] = useReducer(appReducer, initialAppState);
	const effects = useMemo(() => createTuiEffects(createDefaultServices()), []);
	const suggestionRequestId = useRef(0);
	const ruleSuggestionRequestId = useRef(0);

	const allRepos = useMemo(
		() => deriveAllRepos(state.savedRepos, state.openedRepoPaths),
		[state.openedRepoPaths, state.savedRepos],
	);

	const selectedRepo = allRepos[state.repoIndex] ?? null;
	const selectedWorktree = state.worktrees[state.worktreeIndex] ?? null;

	const modeLabel = getModeLabel(state.mode, state.activePane);
	const helpText = getHelpText(state.mode, state.activePane);

	const setMode = useCallback(
		(mode: Mode) => {
			if (!canEnterMode(mode, state)) {
				dispatch({
					type: "setStatus",
					value: "Action not available in current context",
				});
				return;
			}
			dispatch({ type: "setMode", value: mode });
		},
		[state],
	);

	const runBusyTask = useCallback(async (task: () => Promise<void>) => {
		dispatch({ type: "setBusy", value: true });
		try {
			await task();
		} catch (error: unknown) {
			dispatch({ type: "setStatus", value: formatError(error) });
		} finally {
			dispatch({ type: "setBusy", value: false });
		}
	}, []);

	const activateRepo = useCallback(
		async (repoPath: string, persist = false) => {
			const context = await effects.loadRepoContext(
				repoPath,
				persist,
				state.openedRepoPaths,
			);
			dispatch({ type: "setActiveRepoPath", value: context.activeRepoPath });
			dispatch({ type: "setOpenedRepoPaths", value: context.openedRepoPaths });
			dispatch({ type: "setSavedRepos", value: context.savedRepos });
			dispatch({ type: "setRepoIndex", value: context.repoIndex });
			dispatch({ type: "setWorktrees", value: context.worktrees });
			dispatch({ type: "setRepoSettings", value: context.repoSettings });
			dispatch({ type: "setTemplateDraft", value: context.templateDraft });
			dispatch({ type: "setSettingsRuleIndex", value: 0 });
		},
		[effects, state.openedRepoPaths],
	);

	useEffect(() => {
		runBusyTask(async () => {
			const boot = await effects.bootstrap(process.cwd());
			dispatch({ type: "setSavedRepos", value: boot.repos });
			if (boot.context) {
				dispatch({ type: "setBootstrapData", value: boot.context });
			}
			dispatch({ type: "setStatus", value: boot.status });
		});
	}, [effects, runBusyTask]);

	useEffect(() => {
		dispatch({
			type: "setRepoIndex",
			value: clamp(state.repoIndex, allRepos.length),
		});
	}, [allRepos.length, state.repoIndex]);

	useEffect(() => {
		if (state.mode !== "openPath") {
			dispatch({ type: "setOpenSuggestions", value: [] });
			dispatch({ type: "setOpenCompletion", value: null });
			dispatch({ type: "setOpenSuggestionIndex", value: 0 });
			return;
		}

		const id = suggestionRequestId.current + 1;
		suggestionRequestId.current = id;

		effects.loadOpenPathSuggestions(state.openDraft).then((result) => {
			if (id !== suggestionRequestId.current) {
				return;
			}
			dispatch({ type: "setOpenCompletion", value: result.completion });
			dispatch({ type: "setOpenSuggestions", value: result.suggestions });
		});
	}, [effects, state.mode, state.openDraft]);

	useEffect(() => {
		if (state.mode !== "settingsEditRule" || !state.activeRepoPath) {
			dispatch({ type: "setRuleSuggestions", value: [] });
			dispatch({ type: "setRuleCompletion", value: null });
			dispatch({ type: "setRuleSuggestionIndex", value: 0 });
			return;
		}

		const id = ruleSuggestionRequestId.current + 1;
		ruleSuggestionRequestId.current = id;

		getRepoFileSuggestions(state.activeRepoPath, state.ruleDraft).then((result) => {
			if (id !== ruleSuggestionRequestId.current) {
				return;
			}
			dispatch({ type: "setRuleCompletion", value: result.completion });
			dispatch({ type: "setRuleSuggestions", value: result.suggestions });
		});
	}, [state.activeRepoPath, state.mode, state.ruleDraft]);

	const refreshWorktrees = useCallback(async () => {
		if (!state.activeRepoPath) {
			dispatch({ type: "setStatus", value: "Select a repository first" });
			return;
		}
		const worktrees = await effects.refreshWorktreeList(state.activeRepoPath);
		dispatch({ type: "setWorktrees", value: worktrees });
		dispatch({ type: "setStatus", value: "Refreshed worktrees" });
	}, [effects, state.activeRepoPath]);

	const handleCommand = useCallback(
		async (command: Command): Promise<boolean> => {
			if (state.busy && command !== "quit") {
				return false;
			}

			const context = {
				state,
				dispatch,
				effects,
				selectedRepo,
				selectedWorktree,
				runBusyTask,
				activateRepo,
				setMode,
				refreshWorktrees,
				allRepos,
			};

			const modeResult = await handleModeCommand(command, context);
			if (modeResult !== null) {
				return modeResult;
			}

			const baseResult = await handleBaseCommand(command, context);
			if (baseResult !== null) {
				return baseResult;
			}

			return false;
		},
		[
			activateRepo,
			allRepos,
			effects,
			refreshWorktrees,
			runBusyTask,
			selectedRepo,
			selectedWorktree,
			setMode,
			state,
		],
	);

	const handleKey = useCallback(
		async (key: { name?: string; ctrl?: boolean }): Promise<boolean> => {
			const command = routeKey(state, key);
			if (!command) {
				return false;
			}
			return handleCommand(command);
		},
		[handleCommand, state],
	);

	return {
		state,
		allRepos,
		selectedRepo,
		selectedWorktree,
		modeLabel,
		helpText,
		handleKey,
		setActiveTab: (tab: "repos" | "worktrees") =>
			dispatch({ type: "setActiveTab", value: tab }),
		setRepoIndex: (index: number) =>
			dispatch({ type: "setRepoIndex", value: clamp(index, allRepos.length) }),
		setWorktreeIndex: (index: number) =>
			dispatch({
				type: "setWorktreeIndex",
				value: clamp(index, state.worktrees.length),
			}),
		setOpenDraft: (value: string) => dispatch({ type: "setOpenDraft", value }),
		setOpenSuggestionIndex: (index: number) =>
			dispatch({
				type: "setOpenSuggestionIndex",
				value: clamp(index, state.openSuggestions.length),
			}),
		setCreateDraft: (value: string) =>
			dispatch({ type: "setCreateDraft", value }),
		setRuleDraft: (value: string) => dispatch({ type: "setRuleDraft", value }),
		setRuleSuggestionIndex: (index: number) =>
			dispatch({
				type: "setRuleSuggestionIndex",
				value: clamp(index, state.ruleSuggestions.length),
			}),
		activateRepoFromList: async (index: number) =>
			activateRepoFromIndex(index, {
				allRepos,
				runBusyTask,
				activateRepo,
				dispatch,
			}),
		openInputValue: state.openDraft,
		openCompletion: state.openCompletion,
	};
}
