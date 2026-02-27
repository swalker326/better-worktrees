import type { WorktreeInfo } from "../../core/types";

const COLORS = {
  panel: "#243247",
  border: "#4f6a88",
  borderFocus: "#67b3ff",
  mutedText: "#adc5df",
  accent: "#67b3ff",
  accentWarm: "#7be0c7",
};

export function WorktreeList(props: {
  repoPath: string;
  worktrees: WorktreeInfo[];
  selected: number;
  focused: boolean;
  filter: string;
}) {
  return (
    <box
      flexDirection="column"
      gap={1}
      border
      borderStyle={props.focused ? "double" : "single"}
      borderColor={props.focused ? COLORS.borderFocus : COLORS.border}
      backgroundColor={COLORS.panel}
      padding={1}
      flexGrow={2}
      title={` Worktrees (${props.worktrees.length}) `}
    >
      <text>{props.repoPath}</text>
      <text>
        <span fg={COLORS.mutedText}>filter </span>
        <span fg={COLORS.accent}>{props.filter || "(none)"}</span>
      </text>
      <text>
        <span fg={COLORS.mutedText}>current kind branch                   path</span>
      </text>
      {props.worktrees.length === 0 ? (
        <text>
          <span fg={COLORS.mutedText}>No worktrees.</span>
        </text>
      ) : (
        props.worktrees.map((worktree, index) => {
          const marker = index === props.selected ? ">" : " ";
          const current = worktree.isCurrent ? "*" : " ";
          const branch = worktree.branch ?? "(detached)";
          const kind = worktree.isMain ? "main" : "wt  ";
          return (
            <text key={worktree.path}>
              <span fg={index === props.selected ? COLORS.accent : COLORS.mutedText}>{marker}</span>
              <span fg={worktree.isCurrent ? COLORS.accentWarm : COLORS.mutedText}> {current}</span>
              <span fg={worktree.isMain ? COLORS.accentWarm : COLORS.mutedText}> {kind}</span>
              <span> {branch.padEnd(24)} {worktree.path}</span>
            </text>
          );
        })
      )}
    </box>
  );
}
