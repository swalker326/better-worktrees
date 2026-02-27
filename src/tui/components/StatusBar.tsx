const COLORS = {
  panel: "#2f3e55",
  border: "#4f6a88",
  mutedText: "#adc5df",
  accent: "#67b3ff",
};

export function StatusBar(props: { message: string; modeLabel: string }) {
  return (
    <box
      border
      borderColor={COLORS.border}
      backgroundColor={COLORS.panel}
      padding={1}
      title=" Status "
      gap={1}
    >
      <text>
        <span fg={COLORS.accent}>{props.modeLabel}</span>
      </text>
      <text>
        <span fg={COLORS.mutedText}>{props.message}</span>
      </text>
    </box>
  );
}
