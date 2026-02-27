import { describe, expect, it } from "bun:test";

import { routeKey } from "./routeKey";
import { initialAppState } from "../state/types";

describe("routeKey", () => {
  it("always allows ctrl+c quit", () => {
    const command = routeKey({ ...initialAppState, mode: "openPath" }, { name: "c", ctrl: true });
    expect(command).toBe("quit");
  });

  it("disables non-essential globals while typing", () => {
    expect(routeKey({ ...initialAppState, mode: "openPath" }, { name: "q" })).toBeNull();
    expect(routeKey({ ...initialAppState, mode: "createWorktree" }, { name: "p" })).toBeNull();
  });

  it("routes browse keys to browse commands", () => {
    const command = routeKey({ ...initialAppState, mode: "browse" }, { name: "down" });
    expect(command).toBe("navigateNext");
  });

  it("returns null for unmapped key", () => {
    const command = routeKey({ ...initialAppState, mode: "settingsBrowse" }, { name: "z" });
    expect(command).toBeNull();
  });

  it("starts rule editing from settings with enter or a", () => {
    const state = { ...initialAppState, mode: "settingsBrowse" as const };
    expect(routeKey(state, { name: "return" })).toBe("editRule");
    expect(routeKey(state, { name: "a" })).toBe("editRule");
    expect(routeKey(state, { name: "t" })).toBeNull();
  });

  it("does not use function keys", () => {
    const command = routeKey({ ...initialAppState, mode: "browse" }, { name: "f2" });
    expect(command).toBeNull();
  });

  it("maps open path keys", () => {
    const openState = { ...initialAppState, mode: "openPath" as const };
    expect(routeKey(openState, { name: "tab" })).toBe("tabComplete");
    expect(routeKey(openState, { name: "up" })).toBe("navigatePrev");
    expect(routeKey(openState, { name: "down" })).toBe("navigateNext");
    expect(routeKey(openState, { name: "return" })).toBe("submit");
    expect(routeKey(openState, { name: "escape" })).toBe("closeMode");
  });

  it("maps settings edit rule keys", () => {
    const editState = { ...initialAppState, mode: "settingsEditRule" as const };
    expect(routeKey(editState, { name: "tab" })).toBe("tabComplete");
    expect(routeKey(editState, { name: "up" })).toBe("navigatePrev");
    expect(routeKey(editState, { name: "down" })).toBe("navigateNext");
    expect(routeKey(editState, { name: "return" })).toBe("submit");
  });
});
