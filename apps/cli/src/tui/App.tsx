import { useKeyboard, useRenderer } from "@opentui/react";
import { useEffect, useRef } from "react";
import { CreateWorktreeModal } from "./components/CreateWorktreeModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { OpenPathModal } from "./components/modals/OpenPathModal";
import { RepoSelectPanel } from "./components/RepoSelectPanel";
import { RepoSettingsModal } from "./components/RepoSettingsModal";
import { StatusFooter } from "./components/StatusFooter";
import { WorktreeScrollPanel } from "./components/WorktreeScrollPanel";
import { collapseHome } from "./pathDisplay";
import { useAppController } from "./state/useAppController";
import { THEME } from "./theme";

const TAB_OPTIONS = [
  { name: "Repos", description: "Saved and open repos", value: "repos" },
  { name: "Trees", description: "Worktrees in current repo", value: "worktrees" },
];

export function App() {
  const renderer = useRenderer();
  const tabSelectRef = useRef<any>(null);
  const {
    state,
    allRepos,
    selectedWorktree,
    modeLabel,
    helpText,
    handleKey,
    openInputValue,
    openCompletion,
    setActiveTab,
    setRepoIndex,
    setWorktreeIndex,
    setOpenDraft,
    setOpenSuggestionIndex,
    setCreateDraft,
    setRuleDraft,
    setRuleSuggestionIndex,
    activateRepoFromList
  } = useAppController();

  useKeyboard((key) => {
    void handleKey({ name: key.name, ctrl: key.ctrl }).then((shouldQuit) => {
      if (shouldQuit) {
        renderer.destroy();
      }
    });
  });

  const showSettings =
    state.mode === "settingsBrowse" || state.mode === "settingsEditRule";

  const settingsInput =
    state.mode === "settingsEditRule"
        ? "rule"
        : null;

  const handleActivateRepo = (index: number) => {
    void activateRepoFromList(index);
    setActiveTab("worktrees");
    tabSelectRef.current?.setSelectedIndex(1);
  };

  useEffect(() => {
    tabSelectRef.current?.setSelectedIndex(state.activeTab === "repos" ? 0 : 1);
  }, [state.activeTab]);

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      backgroundColor={THEME.base}
      padding={1}
      gap={1}
    >
      <box
        border
        borderStyle="double"
        borderColor={THEME.borderFocus}
        backgroundColor={THEME.panelAlt}
        padding={1}
        flexDirection="row"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <text>
          <strong>
            <span fg={THEME.primary}>Better WorkTree</span>
          </strong>
          <span fg={THEME.mutedSecondary}> | </span>
          <span fg={THEME.secondary}>
            {state.activeRepoPath
              ? collapseHome(state.activeRepoPath)
              : "no repo selected"}
          </span>
        </text>
        <text>
          <span fg={THEME.primary}>[O]</span>
          <span fg={THEME.mutedSecondary}> open path </span>
          <span fg={THEME.primary}>[P]</span>
          <span fg={THEME.mutedSecondary}> settings </span>
          <span fg={THEME.primary}>[R]</span>
          <span fg={THEME.mutedSecondary}> refresh</span>
        </text>
      </box>

      {!showSettings && (
        <box>
          <tab-select
            ref={tabSelectRef}
            options={TAB_OPTIONS}
            tabWidth={15}
            backgroundColor={THEME.panel}
            textColor={THEME.muted}
            focusedTextColor={THEME.text}
            selectedBackgroundColor={THEME.panelAlt}
            selectedTextColor={THEME.primary}
            selectedDescriptionColor={THEME.secondary}
            showUnderline
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              setActiveTab(option.value === "worktrees" ? "worktrees" : "repos");
            }}
            onSelect={(_, option) => {
              if (!option) {
                return;
              }
              setActiveTab(option.value === "worktrees" ? "worktrees" : "repos");
            }}
          />
        </box>
      )}

      {showSettings ? (
        <RepoSettingsModal
          repoPath={state.activeRepoPath ?? ""}
          settings={state.repoSettings}
          selectedRule={state.settingsRuleIndex}
          inputMode={settingsInput}
          ruleDraft={state.ruleDraft}
          ruleCompletion={state.ruleCompletion}
          ruleSuggestions={state.ruleSuggestions}
          selectedRuleSuggestionIndex={state.ruleSuggestionIndex}
          onChangeRuleDraft={setRuleDraft}
          onChangeRuleSuggestionIndex={setRuleSuggestionIndex}
        />
      ) : state.activeTab === "repos" ? (
        <RepoSelectPanel
          repos={allRepos}
          activeRepoPath={state.activeRepoPath}
          selectedIndex={state.repoIndex}
          focused={state.mode === "browse"}
          onChangeIndex={setRepoIndex}
          onSelectIndex={handleActivateRepo}
        />
      ) : (
        <WorktreeScrollPanel
          repoPath={state.activeRepoPath}
          worktrees={state.worktrees}
          selectedIndex={state.worktreeIndex}
          focused={state.mode === "browse"}
          onChangeIndex={setWorktreeIndex}
          onSelectIndex={setWorktreeIndex}
        />
      )}

      {state.mode === "openPath" ? (
        <OpenPathModal
          draft={openInputValue}
          completion={openCompletion}
          suggestions={state.openSuggestions}
          selectedSuggestionIndex={state.openSuggestionIndex}
          onChangeDraft={setOpenDraft}
          onChangeSuggestionIndex={setOpenSuggestionIndex}
        />
      ) : null}

      {state.mode === "createWorktree" ? (
        <CreateWorktreeModal
          draft={state.createDraft}
          onChangeDraft={setCreateDraft}
        />
      ) : null}

      {state.mode === "confirmDelete" && selectedWorktree ? (
        <DeleteConfirmModal target={selectedWorktree.path} />
      ) : null}

      <StatusFooter
        mode={modeLabel}
        status={state.busy ? "Working..." : state.status}
        help={helpText}
      />
    </box>
  );
}
