import { THEME } from "../theme";

export function StatusFooter(props: { mode: string; status: string; help: string }) {
  const isWorking = props.status === "Working...";
  return (
    <box flexDirection="column" gap={1}>
      <box border borderColor={THEME.border} backgroundColor={THEME.panelAlt} padding={1}>
        <text>
          <span fg={THEME.primary}>{props.mode}</span>
          <span fg={THEME.mutedSecondary}>  |  </span>
          <span fg={isWorking ? THEME.warning : THEME.secondary}>{props.status}</span>
        </text>
      </box>
      <text>
        <span fg={THEME.mutedSecondary}>{props.help}</span>
      </text>
    </box>
  );
}
