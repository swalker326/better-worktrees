import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HeaderActions } from "./HeaderActions";

describe("HeaderActions", () => {
  it("renders quick start and github links", () => {
    const html = renderToStaticMarkup(<HeaderActions />);

    expect(html).toContain("/getting-started");
    expect(html).toContain("github.com/swalker326/better-worktrees");
  });
});
