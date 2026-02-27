import { THEME } from "../theme";

const EMPHASIZED_KEYS = new Set([
  "A",
  "C",
  "Delete",
  "Enter",
  "Enter/A",
  "Enter/Y",
  "Esc",
  "Esc/N",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "Tab",
  "Type",
  "U",
  "Up/Down",
  "X",
  "Y",
]);

function renderHelp(help: string) {
  const chunks = help.split("  ").filter(Boolean);
  const seen = new Map<string, number>();
  let isFirstChunk = true;

  return chunks.map((chunk) => {
    const count = seen.get(chunk) ?? 0;
    seen.set(chunk, count + 1);
    const key = `${chunk}-${count}`;
    const isFirst = isFirstChunk;
    isFirstChunk = false;

    const splitIndex = chunk.indexOf(" ");
    if (splitIndex === -1) {
      return (
        <span key={key} fg={THEME.mutedSecondary}>
          {isFirst ? "" : "  "}
          {chunk}
        </span>
      );
    }

    const keyPart = chunk.slice(0, splitIndex);
    const description = chunk.slice(splitIndex + 1);
    const emphasized = EMPHASIZED_KEYS.has(keyPart);

    return (
      <span key={key}>
        <span fg={THEME.mutedSecondary}>{isFirst ? "" : "  "}</span>
        {emphasized ? <span fg={THEME.primary}>[{keyPart}]</span> : <span fg={THEME.mutedSecondary}>{keyPart}</span>}
        <span fg={THEME.mutedSecondary}> {description}</span>
      </span>
    );
  });
}

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
        {renderHelp(props.help)}
      </text>
    </box>
  );
}
