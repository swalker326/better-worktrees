import { describe, expect, it } from "bun:test";

import { CreateWorktreeModal } from "./CreateWorktreeModal";

describe("CreateWorktreeModal", () => {
  it("wires draft updates through input events", () => {
    const onChangeDraft = () => {};

    const tree = CreateWorktreeModal({
      draft: "feature/new-worktree",
      onChangeDraft,
    }) as {
      props: { children: Array<{ props?: Record<string, unknown> }> };
    };

    const inputElement = tree.props.children[1] as {
      props: Record<string, unknown>;
    };

    expect(inputElement.props.onInput).toBe(onChangeDraft);
    expect(inputElement.props.onChange).toBeUndefined();
  });
});
