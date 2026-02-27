import type { TabKey } from "../theme";

const OPTIONS: Array<{ name: string; value: TabKey; description: string }> = [
  { name: "Worktrees", value: "worktrees", description: "Browse and manage worktrees" },
  { name: "Repositories", value: "repositories", description: "Open and save repo roots" },
  { name: "Settings", value: "settings", description: "Template and copy rules" },
];

export function TopTabs(props: {
  focused: boolean;
  resetKey: string;
  onChangeTab: (tab: TabKey) => void;
}) {
  return (
    <tab-select
      key={props.resetKey}
      options={OPTIONS}
      tabWidth={22}
      focused={props.focused}
      onChange={(_, option) => {
        if (!option) {
          return;
        }
        props.onChangeTab(option.value as TabKey);
      }}
      onSelect={(_, option) => {
        if (!option) {
          return;
        }
        props.onChangeTab(option.value as TabKey);
      }}
    />
  );
}
