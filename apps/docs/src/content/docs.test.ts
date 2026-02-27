import { describe, expect, it } from "bun:test";

import { docsNavigation, isDocLinkActive, normalizePathname } from "./docs";

describe("normalizePathname", () => {
  it("keeps root untouched", () => {
    expect(normalizePathname("/")).toBe("/");
  });

  it("adds a leading slash when missing", () => {
    expect(normalizePathname("getting-started")).toBe("/getting-started");
  });

  it("removes trailing slashes for nested paths", () => {
    expect(normalizePathname("/commands///")).toBe("/commands");
  });
});

describe("isDocLinkActive", () => {
  it("matches links with or without trailing slash", () => {
    expect(isDocLinkActive("/getting-started/", "/getting-started")).toBe(true);
  });

  it("does not match different docs routes", () => {
    expect(isDocLinkActive("/commands", "/getting-started")).toBe(false);
  });
});

describe("docsNavigation", () => {
  it("includes a contributing page link", () => {
    const hasContributingLink = docsNavigation.some((section) =>
      section.links.some((link) => link.href === "/contributing"),
    );

    expect(hasContributingLink).toBe(true);
  });
});
