# better-worktrees monorepo

`bwt` is a git worktree manager with one-off commands and an OpenTUI mode.

## Workspace layout

- `apps/cli`: the Bun CLI + TUI app
- `apps/docs`: Astro documentation site

## Install dependencies

```bash
bun install
```

## Run the CLI

```bash
bun run start
```

No args opens the TUI. Commands run in one-off mode.

## Run the docs site

```bash
bun run docs:dev
```

## CLI commands

```bash
bwt list [-R <repo>] [--json]
bwt create <name> [-R <repo>] [--branch <branch>] [--base <base>] [--path <dir>] [--json]
bwt delete <name|path> [-R <repo>] [--yes] [--force]
bwt repo list
bwt repo add <path> [--name <alias>]
bwt repo remove <path>
bwt repo use <path>
bwt repo set-copy <path> --rule <from[:to]> [--rule <from[:to]> ...]
```

## TUI keys

- `j` / `k` or arrows: move selection
- `Enter`: open repo/select
- `a`: add repo or create worktree
- `d`: delete selected worktree
- `x`: remove saved repo
- `r`: refresh worktrees
- `s`: switch back to repo picker
- `?`: help
- `q`: quit
