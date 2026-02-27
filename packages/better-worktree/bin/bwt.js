#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

import { resolvePlatformPackage } from "../scripts/platform.js";

const require = createRequire(import.meta.url);

function resolveBinaryPath(packageName, binaryName) {
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  return join(dirname(packageJsonPath), "bin", binaryName);
}

function run() {
  const { packageName, binaryName } = resolvePlatformPackage();

  let binaryPath;
  try {
    binaryPath = resolveBinaryPath(packageName, binaryName);
  } catch {
    console.error(
      [
        `Missing optional package: ${packageName}`,
        "Reinstall without --omit=optional so the platform binary is installed.",
      ].join("\n"),
    );
    process.exit(1);
  }

  const child = spawn(binaryPath, process.argv.slice(2), {
    stdio: "inherit",
    windowsHide: false,
  });

  child.on("error", (error) => {
    console.error(`Failed to launch bwt: ${error.message}`);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 1);
  });
}

run();
