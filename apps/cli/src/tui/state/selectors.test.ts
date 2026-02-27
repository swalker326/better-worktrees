import { describe, expect, it } from "bun:test";

import { deriveAllRepos, getHelpText, getModeLabel } from "./selectors";

describe("selectors", () => {
  it("merges saved and opened repos without duplicates", () => {
    const repos = deriveAllRepos(
      [{ path: "/repo/a", name: "a" }],
      ["/repo/a", "/repo/b"],
    );

    expect(repos).toEqual([
      { path: "/repo/a", name: "a", saved: true },
      { path: "/repo/b", name: "b", saved: false },
    ]);
  });

  it("formats mode labels for browse and settings", () => {
    expect(getModeLabel("browse", "repos")).toBe("BROWSE REPOSITORIES");
    expect(getModeLabel("settingsEditRule", "worktrees")).toBe("SETTINGS COPY RULE");
  });

  it("returns mode-specific help text", () => {
    expect(getHelpText("openPath", "repos")).toContain("Tab accept/advance");
    expect(getHelpText("browse", "worktrees")).toContain("C create");
  });
});
