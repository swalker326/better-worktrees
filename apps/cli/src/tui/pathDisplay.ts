import os from "node:os";
import path from "node:path";

export function collapseHome(value: string, homeDir = os.homedir()): string {
  if (!value) {
    return value;
  }

  const normalizedHome = path.resolve(homeDir);
  const normalizedValue = path.resolve(value);

  if (normalizedValue === normalizedHome) {
    return "~";
  }

  const homePrefix = `${normalizedHome}${path.sep}`;
  if (normalizedValue.startsWith(homePrefix)) {
    const relative = normalizedValue.slice(homePrefix.length);
    return `~/${relative}`;
  }

  return value;
}
