import { THEME } from "../theme";
import { collapseHome } from "../pathDisplay";

type RepoItem = { path: string; name: string; saved: boolean };

export function RepoSelectPanel(props: {
  repos: RepoItem[];
  activeRepoPath: string | null;
  selectedIndex: number;
  focused: boolean;
  onChangeIndex: (index: number) => void;
  onSelectIndex: (index: number) => void;
}) {
  const options = props.repos.map((repo) => ({
    name: `${repo.saved ? "[saved]" : "[open]"} ${repo.name}`,
    description: collapseHome(repo.path),
    value: repo.path,
  }));

  return (
    <box
      flexDirection="column"
      border
      borderStyle="double"
      borderColor={props.focused ? THEME.borderFocus : THEME.border}
      backgroundColor={THEME.panel}
      title={` Repositories ${props.repos.length} `}
      padding={1}
      gap={1}
      width="34%"
    >
      {options.length > 0 ? (
        <select
          options={options}
          focused={props.focused}
          selectedIndex={props.selectedIndex}
          height={14}
          showDescription
          showScrollIndicator
          selectedBackgroundColor={THEME.borderFocus}
          selectedTextColor={THEME.panelAlt}
          onChange={(index) => props.onChangeIndex(index)}
          onSelect={(index) => props.onSelectIndex(index)}
        />
      ) : (
        <box border borderColor={THEME.border} padding={1}>
          <text>
            <span fg={THEME.muted}>No repositories. Press o to open one.</span>
          </text>
        </box>
      )}
      <text>
        <span fg={THEME.muted}>
          Tab pane  Up/Down move  Enter open
        </span>
      </text>
    </box>
  );
}
