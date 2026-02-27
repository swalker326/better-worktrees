const COLORS = {
  panel: "#243247",
  border: "#4f6a88",
  borderFocus: "#67b3ff",
  mutedText: "#adc5df",
  accent: "#67b3ff",
  accentWarm: "#7be0c7",
};

export function RepoPicker(props: {
  repos: Array<{ path: string; name: string }>;
  selected: number;
  activeRepo: string | null;
  focused: boolean;
  filter: string;
  isAdding: boolean;
  addDraft: string;
  suggestions: string[];
  selectedSuggestion: number;
}) {
  return (
    <box
      flexDirection="column"
      border
      borderStyle={props.focused ? "double" : "single"}
      borderColor={props.focused ? COLORS.borderFocus : COLORS.border}
      backgroundColor={COLORS.panel}
      padding={1}
      gap={1}
      flexGrow={1}
      title={` Repositories (${props.repos.length}) `}
    >
      <text>
        <span fg={COLORS.mutedText}>filter </span>
        <span fg={COLORS.accent}>{props.filter || "(none)"}</span>
      </text>
      {props.repos.length === 0 ? (
        <text>
          <span fg={COLORS.mutedText}>
          No matching repos. Press a to add one.
          </span>
        </text>
      ) : (
        props.repos.map((repo, index) => (
          <text key={repo.path}>
            <span fg={index === props.selected ? COLORS.accent : COLORS.mutedText}>
              {index === props.selected ? ">" : " "}
            </span>
            <span fg={repo.path === props.activeRepo ? COLORS.accentWarm : COLORS.mutedText}> {repo.path === props.activeRepo ? "*" : " "}</span>
            <span> {repo.name}</span>
          </text>
        ))
      )}
      {props.repos.length > 0 ? (
        <text>
          <span fg={COLORS.mutedText}>{props.repos[props.selected]?.path ?? ""}</span>
        </text>
      ) : null}
      {props.isAdding ? (
        <box flexDirection="column" border borderColor={COLORS.border} padding={1}>
          <text>
            <strong>
              <span fg={COLORS.accent}>Add repository path</span>
            </strong>
          </text>
          <text>
            <span fg={COLORS.accentWarm}>{props.addDraft || "_"}</span>
          </text>
          {props.suggestions.length > 0 ? (
            <box flexDirection="column" gap={0}>
              {props.suggestions.map((suggestion, index) => (
                <text key={suggestion}>
                  <span fg={index === props.selectedSuggestion ? COLORS.accent : COLORS.mutedText}>
                    {index === props.selectedSuggestion ? ">" : " "}
                  </span>
                  <span fg={index === props.selectedSuggestion ? COLORS.accentWarm : COLORS.mutedText}> {suggestion}</span>
                </text>
              ))}
            </box>
          ) : (
            <text>
              <span fg={COLORS.mutedText}>No path suggestions</span>
            </text>
          )}
          <text>
            <span fg={COLORS.mutedText}>Tab complete, j/k choose suggestion, Enter save, Esc cancel</span>
          </text>
        </box>
      ) : null}
    </box>
  );
}
