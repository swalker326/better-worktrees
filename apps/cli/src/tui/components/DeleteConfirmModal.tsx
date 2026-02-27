import { collapseHome } from "../pathDisplay";
import { THEME } from "../theme";

export function DeleteConfirmModal(props: { target: string }) {
  return (
    <box
      flexDirection="column"
      border
      borderStyle="double"
      borderColor={THEME.danger}
      backgroundColor={THEME.panel}
      padding={1}
      gap={1}
      title=" Confirm Delete "
    >
      <text>
        <span fg={THEME.text}>Delete </span>
        <span fg={THEME.danger}>{collapseHome(props.target)}</span>
        <span fg={THEME.text}> ?</span>
      </text>
      <text>
        <span fg={THEME.muted}>Enter/Y delete  Esc/N cancel</span>
      </text>
    </box>
  );
}
