import os from "node:os";
import path from "node:path";

const DEFAULT_MAX_WIDTH = 50;

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

export function truncateMiddle(
  value: string,
  maxWidth: number = DEFAULT_MAX_WIDTH
): string {
  if (!value || value.length <= maxWidth) {
    return value;
  }

  const ellipsis = "…";
  const availableWidth = maxWidth - ellipsis.length;
  const halfWidth = Math.floor(availableWidth / 2);
  
  const start = value.slice(0, halfWidth);
  const end = value.slice(-(availableWidth - halfWidth));
  
  return `${start}${ellipsis}${end}`;
}
