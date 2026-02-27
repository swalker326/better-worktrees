import { GLOBAL_BINDINGS, MODE_BINDINGS } from "./bindings";
import type { AppState, Command, KeyboardKey } from "../state/types";

function keyId(key: KeyboardKey): string {
  const name = key.name?.toLowerCase();
  if (!name) {
    return "";
  }
  return key.ctrl ? `ctrl+${name}` : name;
}

export function routeKey(state: AppState, key: KeyboardKey): Command | null {
  const id = keyId(key);
  if (!id) {
    return null;
  }

  const typingMode =
    state.mode === "openPath" ||
    state.mode === "createWorktree" ||
    state.mode === "settingsEditRule";

  if (id === "ctrl+c") {
    return "quit";
  }

  if (!typingMode || id === "escape") {
    const global = GLOBAL_BINDINGS[id];
    if (global) {
      return global;
    }
  }

  const modeMap = MODE_BINDINGS[state.mode];
  return modeMap[id] ?? null;
}
