import { describe, expect, it } from "bun:test";

import { collapseHome } from "./pathDisplay";

describe("collapseHome", () => {
  it("collapses home directory to ~", () => {
    expect(collapseHome("/tmp/home", "/tmp/home")).toBe("~");
    expect(collapseHome("/tmp/home/projects/repo", "/tmp/home")).toBe("~/projects/repo");
  });

  it("leaves non-home paths unchanged", () => {
    expect(collapseHome("/tmp/other", "/tmp/home")).toBe("/tmp/other");
  });
});
