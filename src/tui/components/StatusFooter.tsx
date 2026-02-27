import { THEME } from "../theme";

export function StatusFooter(props: { mode: string; status: string; help: string }) {
  return (
    <box flexDirection="column" gap={1}>
      <box border borderColor={THEME.border} backgroundColor={THEME.panelAlt} padding={1}>
        <text>
          <span fg={THEME.accent}>{props.mode}</span>
          <span fg={THEME.muted}>  |  </span>
          <span fg={THEME.text}>{props.status}</span>
        </text>
      </box>
      <text>
        <span fg={THEME.muted}>{props.help}</span>
      </text>
    </box>
  );
}
