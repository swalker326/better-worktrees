import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

import { runCli } from "./parse";

describe("runCli version flag", () => {
  const originalVersion = process.env.BWT_VERSION;

  beforeEach(() => {
    process.env.BWT_VERSION = "9.9.9";
  });

  afterEach(() => {
    process.env.BWT_VERSION = originalVersion;
    mock.restore();
  });

  it("prints version for --version", async () => {
    const logSpy = mock(() => {});
    console.log = logSpy;

    await runCli(["--version"]);

    expect(logSpy).toHaveBeenCalledWith("9.9.9");
  });

  it("prints version for version command", async () => {
    const logSpy = mock(() => {});
    console.log = logSpy;

    await runCli(["version"]);

    expect(logSpy).toHaveBeenCalledWith("9.9.9");
  });
});
