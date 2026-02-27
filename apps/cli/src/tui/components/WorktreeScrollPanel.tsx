import type { WorktreeInfo } from "../../core/types";
import { collapseHome } from "../pathDisplay";
import { THEME } from "../theme";

export function WorktreeScrollPanel(props: {
  repoPath: string | null;
  worktrees: WorktreeInfo[];
  selectedIndex: number;
  focused: boolean;
  onChangeIndex: (index: number) => void;
  onSelectIndex: (index: number) => void;
}) {
  const options = props.worktrees.map((worktree) => ({
    name: `${worktree.isCurrent ? "*" : " "} ${worktree.branch ?? "(detached)"}`,
    description: collapseHome(worktree.path),
    value: worktree.path,
  }));

  const selected = props.worktrees[props.selectedIndex] ?? null;

  return (
    <box
      flexDirection="column"
      border
      borderStyle="double"
      borderColor={props.focused ? THEME.borderFocus : THEME.border}
      backgroundColor={THEME.panel}
      title={` Worktrees ${props.worktrees.length} `}
      padding={1}
      gap={1}
      flexGrow={1}
    >
      <text>
        <span fg={THEME.muted}>{props.repoPath ? collapseHome(props.repoPath) : "No repo selected"}</span>
      </text>
      {options.length > 0 ? (
        <select
          options={options}
          focused={props.focused}
          selectedIndex={props.selectedIndex}
          height={10}
          showDescription
          showScrollIndicator
          selectedBackgroundColor={THEME.borderFocus}
          selectedTextColor={THEME.panelAlt}
          onChange={(index) => props.onChangeIndex(index)}
          onSelect={(index) => props.onSelectIndex(index)}
        />
      ) : (
        <box border borderColor={THEME.border} padding={1}>
          <text>
            <span fg={THEME.muted}>No worktrees found for this repo.</span>
          </text>
        </box>
      )}

      <scrollbox
        focused={false}
        height={8}
        border
        borderColor={THEME.border}
        verticalScrollbarOptions={{
          trackOptions: {
            foregroundColor: THEME.border,
            backgroundColor: THEME.panelAlt,
          },
          showArrows: true,
        }}
        viewportOptions={{ backgroundColor: THEME.panelAlt }}
        contentOptions={{ padding: 1 }}
      >
        <text>
          <strong>
            <span fg={THEME.accent2}>Selected Worktree Details</span>
          </strong>
        </text>
        {selected ? (
          <box flexDirection="column" gap={1}>
            <text>
              <span fg={THEME.muted}>branch </span>
              <span fg={THEME.text}>{selected.branch ?? "(detached)"}</span>
            </text>
            <text>
              <span fg={THEME.muted}>path </span>
              <span fg={THEME.text}>{collapseHome(selected.path)}</span>
            </text>
            <text>
              <span fg={THEME.muted}>head </span>
              <span fg={THEME.text}>{selected.head}</span>
            </text>
            <text>
              <span fg={selected.isCurrent ? THEME.accent2 : THEME.muted}>
                {selected.isCurrent ? "current context" : "not current context"}
              </span>
            </text>
          </box>
        ) : (
          <text>
            <span fg={THEME.muted}>Select a worktree to preview details.</span>
          </text>
        )}
      </scrollbox>
      <text>
        <span fg={THEME.muted}>C create  X delete  R refresh  P settings</span>
      </text>
    </box>
  );
}
