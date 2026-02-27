# better-worktrees monorepo

`bwt` is a git worktree manager with one-off commands and an OpenTUI mode.

## Workspace layout

- `apps/cli`: source for the CLI + TUI app
- `apps/docs`: Astro documentation site
- `packages/better-worktree`: npm launcher package (`bwt`)
- `packages/better-worktree-*`: platform-specific binary packages

## Contributing and local builds

For local development setup, build/test commands, and contribution workflow, see
`CONTRIBUTING.md`.

## Install CLI from npm

```bash
npm install -g better-worktree
```

or run it without installing globally:

```bash
npx better-worktree --help
```

The npm install path does not require Bun on the user's machine. It installs a prebuilt
platform binary and launches it via `bwt`.

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
