import { describe, expect, it } from "bun:test";

import { RepoSettingsModal } from "./RepoSettingsModal";

type Node = { type?: string; props?: Record<string, unknown> & { children?: unknown } };

function findNodesByType(node: unknown, type: string, found: Node[] = []): Node[] {
  if (!node || typeof node !== "object") {
    return found;
  }

  const current = node as Node;
  if (current.type === type) {
    found.push(current);
  }

  const children = current.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => findNodesByType(child, type, found));
  } else {
    findNodesByType(children, type, found);
  }

  return found;
}

describe("RepoSettingsModal", () => {
  it("renders only one editable input for adding rules", () => {
    const onChangeRuleDraft = () => {};
    const tree = RepoSettingsModal({
      repoPath: "/repo",
      settings: { nameTemplate: "BWT_fixed", copyAfterCreate: [] },
      selectedRule: 0,
      inputMode: "rule",
      ruleDraft: "",
      ruleCompletion: null,
      ruleSuggestions: [],
      selectedRuleSuggestionIndex: 0,
      onChangeRuleDraft,
      onChangeRuleSuggestionIndex: () => {},
    });

    const inputs = findNodesByType(tree, "input");
    expect(inputs).toHaveLength(1);
    expect(inputs[0]?.props?.onInput).toBe(onChangeRuleDraft);
    expect(inputs[0]?.props?.onChange).toBeUndefined();
  });
});
