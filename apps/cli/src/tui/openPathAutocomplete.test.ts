import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "bun:test";

import {
  expandHome,
  getPathSuggestions,
  resolveOpenPathSubmission,
  resolveTabCompletion,
} from "./openPathAutocomplete";

describe("openPathAutocomplete", () => {
  it("expands tilde to provided home directory", () => {
    expect(expandHome("~", "/tmp/home")).toBe("/tmp/home");
    expect(expandHome("~/projects", "/tmp/home")).toBe("/tmp/home/projects");
    expect(expandHome("/tmp/other", "/tmp/home")).toBe("/tmp/other");
  });

  it("suggests home children for empty draft", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-autocomplete-empty-"));
    const fakeHome = path.join(root, "home");
    await mkdir(path.join(fakeHome, "Developer"), { recursive: true });
    await mkdir(path.join(fakeHome, "Downloads"), { recursive: true });
    await writeFile(path.join(fakeHome, "notes.txt"), "x\n", "utf8");

    try {
      const result = await getPathSuggestions("", { homeDir: fakeHome, maxResults: 20 });
      expect(result.completion).toBeNull();
      expect(result.suggestions).toEqual(["~/Developer", "~/Downloads"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("provides completion and child directories for partial input", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-autocomplete-dev-"));
    const fakeHome = path.join(root, "home");
    const devDir = path.join(fakeHome, "Developer");
    await mkdir(path.join(devDir, "alpha"), { recursive: true });
    await mkdir(path.join(devDir, "beta"), { recursive: true });

    try {
      const result = await getPathSuggestions("~/Dev", { homeDir: fakeHome, maxResults: 20 });
      expect(result.completion).toBe("~/Developer");
      expect(result.suggestions).toEqual([
        "~/Developer",
        "~/Developer/alpha",
        "~/Developer/beta",
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("prioritizes shallow match before nested directories", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-autocomplete-shallow-"));
    const base = path.join(root, "Developer");
    const opencode = path.join(base, "opencode");
    await mkdir(path.join(opencode, "apps"), { recursive: true });
    await mkdir(path.join(opencode, "packages"), { recursive: true });

    try {
      const result = await getPathSuggestions(path.join(base, "opencode"), {
        maxResults: 20,
      });
      expect(result.suggestions).toEqual([
        path.join(base, "opencode"),
        path.join(opencode, "apps"),
        path.join(opencode, "packages"),
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("lists child directories for trailing slash context", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "bwt-autocomplete-slash-"));
    const parent = path.join(root, "workspace");
    await mkdir(path.join(parent, "one"), { recursive: true });
    await mkdir(path.join(parent, "two"), { recursive: true });

    try {
      const result = await getPathSuggestions(`${parent}/`, { maxResults: 20 });
      expect(result.completion).toBe(parent);
      expect(result.suggestions).toEqual([path.join(parent, "one"), path.join(parent, "two")]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("tab accepts completion first then falls back to selected suggestion", () => {
    expect(
      resolveTabCompletion("~/Dev", "~/Developer", ["~/Developer/alpha", "~/Developer/beta"], 0),
    ).toBe("~/Developer");

    expect(
      resolveTabCompletion(
        "~/Developer",
        "~/Developer",
        ["~/Developer/alpha", "~/Developer/beta"],
        1,
      ),
    ).toBe("~/Developer/beta");
  });

  it("submit prefers typed value and falls back to selected suggestion", () => {
    const typed = resolveOpenPathSubmission("~/typed", ["~/Developer/alpha"], 0, "/home/test");
    expect(typed).toBe("/home/test/typed");

    const selected = resolveOpenPathSubmission("", ["~/Developer/alpha"], 0, "/home/test");
    expect(selected).toBe("/home/test/Developer/alpha");
  });
});
