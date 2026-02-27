import { THEME } from "../theme";

export function StatusBar(props: { message: string; modeLabel: string }) {
  return (
    <box
      border
      borderColor={THEME.border}
      backgroundColor={THEME.panelAlt}
      padding={1}
      title=" Status "
      gap={1}
    >
      <text>
        <span fg={THEME.primary}>{props.modeLabel}</span>
      </text>
      <text>
        <span fg={THEME.mutedSecondary}>{props.message}</span>
      </text>
    </box>
  );
}
