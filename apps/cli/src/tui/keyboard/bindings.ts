import type { Command, Mode } from "../state/types";

export type KeyMap = Record<string, Command>;

export const GLOBAL_BINDINGS: KeyMap = {
  "ctrl+c": "quit",
  q: "quit",
  o: "openPath",
  p: "openSettings",
  escape: "closeMode",
};

export const MODE_BINDINGS: Record<Mode, KeyMap> = {
  browse: {
    tab: "togglePane",
    left: "switchPanePrev",
    right: "switchPaneNext",
    up: "navigatePrev",
    down: "navigateNext",
    return: "activateSelection",
    r: "refresh",
    m: "saveRepo",
    u: "unsaveRepo",
    c: "openCreate",
    x: "openDelete",
    delete: "openDelete",
  },
  openPath: {
    up: "navigatePrev",
    down: "navigateNext",
    tab: "tabComplete",
    return: "submit",
  },
  createWorktree: {
    return: "submit",
  },
  confirmDelete: {
    y: "deleteConfirm",
    return: "deleteConfirm",
    n: "closeMode",
  },
  settingsBrowse: {
    up: "navigatePrev",
    down: "navigateNext",
    a: "editRule",
    return: "editRule",
    delete: "removeRule",
  },
  settingsEditRule: {
    up: "navigatePrev",
    down: "navigateNext",
    tab: "tabComplete",
    return: "submit",
  },
};
