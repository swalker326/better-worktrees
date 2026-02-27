export interface DocsLink {
  label: string;
  href: string;
}

export interface DocsSection {
  title: string;
  links: DocsLink[];
}

export const docsNavigation: DocsSection[] = [
  {
    title: "Getting Started",
    links: [
      { label: "Overview", href: "/" },
      { label: "Install and Setup", href: "/getting-started" },
    ],
  },
  {
    title: "Reference",
    links: [{ label: "Commands", href: "/commands" }],
  },
  {
    title: "Project",
    links: [{ label: "Contributing", href: "/contributing" }],
  },
];

export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withLeadingSlash === "/") {
    return withLeadingSlash;
  }
  return withLeadingSlash.replace(/\/+$/, "");
}

export function isDocLinkActive(pathname: string, href: string): boolean {
  return normalizePathname(pathname) === normalizePathname(href);
}
