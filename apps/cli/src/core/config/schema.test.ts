import { describe, expect, it } from "bun:test";

import { normalizeConfig } from "./schema";

describe("normalizeConfig", () => {
  it("applies default name template", () => {
    const config = normalizeConfig({
      repos: {
        "/tmp/repo": {
          copyAfterCreate: [{ from: ".env.local" }],
        },
      },
      repoOrder: ["/tmp/repo"],
    });

    expect(config.repos["/tmp/repo"]?.nameTemplate).toBe(
      "BWT_<project_name>_wt_<branch_name>",
    );
    expect(config.repos["/tmp/repo"]?.copyAfterCreate?.[0]?.to).toBe(
      ".env.local",
    );
  });

  it("dedupes repoOrder while preserving order", () => {
    const config = normalizeConfig({
      repoOrder: ["/tmp/a", "/tmp/b", "/tmp/a", "", "/tmp/c", "/tmp/b"],
      repos: {
        "/tmp/a": {},
        "/tmp/b": {},
        "/tmp/c": {},
      },
    });

    expect(config.repoOrder).toEqual(["/tmp/a", "/tmp/b", "/tmp/c"]);
  });
});
