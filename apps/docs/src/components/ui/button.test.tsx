import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "./button";

describe("Button", () => {
  it("renders with variant classes", () => {
    const html = renderToStaticMarkup(<Button variant="ghost">Docs</Button>);

    expect(html).toContain("hover:bg-muted");
    expect(html).toContain(">Docs<");
  });
});
