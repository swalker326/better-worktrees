# better-worktree (`bwt`)

`bwt` is a Git worktree manager with both one-off CLI commands and a keyboard-first TUI.

![better-worktree TUI screenshot](apps/docs/better-worktree-screenshot.png)

## Quickstart

Install globally:

```bash
npm install -g better-worktree
```

Or run without installing:

```bash
npx better-worktree --help
```

Open the interactive TUI:

```bash
bwt
```

Common first-run flow:

```bash
bwt repo add /path/to/repo --name app
bwt repo list
bwt create feat-login -R app --branch feat/login
bwt list -R app
```

## Core commands

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

## TUI highlights

- Save active repo: `M`
- Remove saved repo: `U`
- Open repo settings: `P`
- Create worktree: `C`
- Delete selected worktree: `X`
- Refresh: `R`

In Repo Settings, add copy rules (`from[:to]`, for example `.env.local:.env.local`) and those files will be copied automatically when creating new worktrees for that repo.

## Documentation

- Live docs: https://better-worktrees.dev
- Docs site: `apps/docs`
- User docs entry point: `apps/docs/src/pages/index.astro`

## Contributing

If you want to work on `bwt` itself (local setup, tests, release flow), see `CONTRIBUTING.md`.
