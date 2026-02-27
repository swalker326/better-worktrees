import { describe, expect, it } from "bun:test";

import { OpenPathModal } from "./OpenPathModal";

describe("OpenPathModal", () => {
  it("wires draft updates through input events", () => {
    const onChangeDraft = () => {};

    const tree = OpenPathModal({
      draft: "~/",
      completion: null,
      suggestions: [],
      selectedSuggestionIndex: 0,
      onChangeDraft,
      onChangeSuggestionIndex: () => {},
    }) as {
      props: { children: Array<{ props?: Record<string, unknown> }> };
    };

    const inputElement = tree.props.children[0] as {
      props: Record<string, unknown>;
    };

    expect(inputElement.props.onInput).toBe(onChangeDraft);
    expect(inputElement.props.onChange).toBeUndefined();
  });
});
