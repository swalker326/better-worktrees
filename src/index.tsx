#!/usr/bin/env bun

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

import { runCli } from "./cli/parse";
import { formatError } from "./core/errors";
import { App } from "./tui/App";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length > 0) {
    await runCli(argv);
    return;
  }

  const renderer = await createCliRenderer();
  createRoot(renderer).render(<App />);
}

main().catch((error: unknown) => {
  console.error(`Error: ${formatError(error)}`);
  process.exit(1);
});
