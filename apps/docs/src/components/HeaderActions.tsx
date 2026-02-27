import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="link" className="h-auto p-0 text-[13px] no-underline hover:no-underline">
        <a href="/getting-started">Quick Start</a>
      </Button>
      <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:bg-transparent hover:text-secondary">
        <a
          href="https://github.com/swalker326/better-worktrees"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="better-worktree on GitHub"
        >
          <Github className="size-4" />
        </a>
      </Button>
    </div>
  );
}
