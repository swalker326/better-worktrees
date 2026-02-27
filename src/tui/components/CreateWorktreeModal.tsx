import { THEME } from "../theme";

export function CreateWorktreeModal(props: { draft: string; onChangeDraft: (value: string) => void }) {
  return (
    <box
      flexDirection="column"
      border
      borderStyle="double"
      borderColor={THEME.borderFocus}
      backgroundColor={THEME.panel}
      padding={1}
      gap={1}
      title=" Create Worktree "
    >
      <text>
        <span fg={THEME.muted}>Branch name</span>
      </text>
      <input
        value={props.draft}
        onChange={props.onChangeDraft}
        focused
        placeholder="feature/new-worktree"
        backgroundColor={THEME.panelAlt}
        focusedBackgroundColor={THEME.panelAlt}
        textColor={THEME.text}
        cursorColor={THEME.accent}
        placeholderColor={THEME.muted}
      />
      <text>
        <span fg={THEME.muted}>Enter create  Esc cancel</span>
      </text>
    </box>
  );
}
