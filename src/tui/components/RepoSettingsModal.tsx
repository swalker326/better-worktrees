import type { RepoSettings } from "../../core/types";
import { collapseHome } from "../pathDisplay";
import { THEME } from "../theme";

type InputMode = "rule" | null;

export function RepoSettingsModal(props: {
  repoPath: string;
  settings: RepoSettings | null;
  selectedRule: number;
  inputMode: InputMode;
  ruleDraft: string;
  ruleCompletion: string | null;
  ruleSuggestions: string[];
  selectedRuleSuggestionIndex: number;
  onChangeRuleDraft: (value: string) => void;
  onChangeRuleSuggestionIndex: (index: number) => void;
}) {
  const rules = props.settings?.copyAfterCreate ?? [];

  return (
    <box
      flexDirection="column"
      border
      borderStyle="double"
      borderColor={THEME.borderFocus}
      backgroundColor={THEME.panel}
      padding={1}
      gap={1}
      title=" Repo Settings "
    >
      <text>
        <span fg={THEME.muted}>{collapseHome(props.repoPath)}</span>
      </text>

      <box flexDirection="column" gap={1}>
        <text>
          <span fg={THEME.muted}>Add files to copy (Enter/A):</span>
        </text>
        <input
          value={props.ruleDraft}
          onInput={props.onChangeRuleDraft}
          focused={props.inputMode === "rule"}
          placeholder=".env.local:.env.local"
          backgroundColor={THEME.panelAlt}
          focusedBackgroundColor={THEME.panelAlt}
          textColor={THEME.text}
          cursorColor={THEME.accent}
          placeholderColor={THEME.muted}
        />
        <select
          options={props.ruleSuggestions.map((item) => ({
            name: item,
            description: item.endsWith("/") ? "directory" : "file",
            value: item,
          }))}
          selectedIndex={props.selectedRuleSuggestionIndex}
          onChange={(index) => props.onChangeRuleSuggestionIndex(index)}
          onSelect={(index, option) => {
            props.onChangeRuleSuggestionIndex(index);
            if (option?.value && typeof option.value === "string") {
              props.onChangeRuleDraft(option.value);
            }
          }}
          height={5}
          showDescription
          showScrollIndicator
        />
        <text>
          <span fg={THEME.muted}>Tab completion: </span>
          <span fg={props.ruleCompletion ? THEME.accent2 : THEME.muted}>
            {props.ruleCompletion ?? "(no match yet)"}
          </span>
        </text>
        {props.inputMode === "rule" ? (
          <text>
            <span fg={THEME.accent}>Pick a file and press Enter to add, or Esc to cancel</span>
          </text>
        ) : null}
      </box>

      <text>
        <span fg={THEME.muted}>Copy rules ({rules.length})</span>
      </text>
      <scrollbox
        height={10}
        verticalScrollbarOptions={{ showArrows: true }}
        viewportOptions={{ backgroundColor: THEME.panelAlt }}
      >
        {rules.length === 0 ? (
          <text>
            <span fg={THEME.muted}>(none)</span>
          </text>
        ) : (
          rules.map((rule, index) => (
            <text key={`${rule.from}-${rule.to ?? rule.from}-${index}`}>
              <span fg={index === props.selectedRule ? THEME.accent : THEME.text}>
                {index === props.selectedRule ? ">" : " "} {rule.from}
              </span>
              <span fg={THEME.muted}> -&gt; </span>
              <span fg={THEME.accent2}>{rule.to ?? rule.from}</span>
            </text>
          ))
        )}
      </scrollbox>

      <text>
        <span fg={THEME.muted}>Up/Down select  Enter/A add file  Delete remove  Esc back</span>
      </text>
    </box>
  );
}
