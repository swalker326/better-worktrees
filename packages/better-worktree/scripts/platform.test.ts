import { describe, expect, it } from "bun:test";

import { isMusl, resolvePlatformPackage } from "./platform.js";

describe("isMusl", () => {
  it("returns false when glibc runtime is reported", () => {
    expect(
      isMusl({
        header: {
          glibcVersionRuntime: "2.39",
        },
      }),
    ).toBeFalse();
  });
});

describe("resolvePlatformPackage", () => {
  it("maps darwin arm64 to the arm64 package", () => {
    expect(resolvePlatformPackage("darwin", "arm64", false)).toEqual({
      packageName: "better-worktree-darwin-arm64",
      binaryName: "bwt",
    });
  });

  it("maps linux x64 glibc to linux x64 package", () => {
    expect(resolvePlatformPackage("linux", "x64", false)).toEqual({
      packageName: "better-worktree-linux-x64",
      binaryName: "bwt",
    });
  });

  it("maps windows x64 to exe package", () => {
    expect(resolvePlatformPackage("win32", "x64", false)).toEqual({
      packageName: "better-worktree-windows-x64",
      binaryName: "bwt.exe",
    });
  });

  it("throws for unsupported platform", () => {
    expect(() => resolvePlatformPackage("aix", "x64", false)).toThrow(
      "Unsupported platform/architecture",
    );
  });
});
