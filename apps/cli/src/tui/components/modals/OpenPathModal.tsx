import { THEME } from "../../theme";

export function OpenPathModal(props: {
  draft: string;
  completion: string | null;
  suggestions: string[];
  selectedSuggestionIndex: number;
  onChangeDraft: (value: string) => void;
  onChangeSuggestionIndex: (index: number) => void;
}) {
  return (
    <box
      border
      borderStyle="double"
      borderColor={THEME.borderFocus}
      backgroundColor={THEME.panel}
      padding={1}
      title=" Open Repo or Worktree Path "
      flexDirection="column"
      gap={1}
    >
      <input
        value={props.draft}
        onInput={props.onChangeDraft}
        focused
        placeholder="Enter path"
        backgroundColor={THEME.panelAlt}
        focusedBackgroundColor={THEME.panelAlt}
        textColor={THEME.text}
        cursorColor={THEME.primary}
        placeholderColor={THEME.muted}
      />
      <select
        options={props.suggestions.map((item) => ({ name: item, description: "directory", value: item }))}
        selectedIndex={props.selectedSuggestionIndex}
        onChange={(index) => props.onChangeSuggestionIndex(index)}
        onSelect={(index, option) => {
          props.onChangeSuggestionIndex(index);
          if (option?.value && typeof option.value === "string") {
            props.onChangeDraft(option.value);
          }
        }}
        height={5}
        showDescription
        showScrollIndicator
        selectedBackgroundColor={THEME.primaryBg}
        selectedTextColor={THEME.text}
      />
      <text>
        <span fg={THEME.mutedSecondary}>Tab completion: </span>
        <span fg={props.completion ? THEME.secondary : THEME.muted}>
          {props.completion ?? "(no match yet)"}
        </span>
      </text>
      <text>
        <span fg={THEME.mutedSecondary}>Enter open  Tab autocomplete  Up/Down pick  Esc close</span>
      </text>
    </box>
  );
}
