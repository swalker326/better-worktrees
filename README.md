# better-worktree

`bwt` is a git worktree manager with both one-off commands and an OpenTUI mode.

## Install

```bash
bun install
```

## Run

```bash
bun run src/index.tsx
```

No args opens the TUI. Commands run in one-off mode.

## Commands

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

## Config

Global config lives at:

`~/.config/bwt/config.json`

Example:

```json
{
  "version": 1,
  "lastRepo": "/Users/you/Developer/better-worktree",
  "repoOrder": ["/Users/you/Developer/better-worktree"],
  "repos": {
    "/Users/you/Developer/better-worktree": {
      "name": "better-worktree",
      "defaultBase": "main",
      "worktreeRoot": "/Users/you/Developer/worktrees",
      "nameTemplate": "BWT_<project_name>_wt_<branch_name>",
      "copyAfterCreate": [
        {
          "from": ".env.local",
          "to": ".env.local",
          "overwrite": false,
          "required": false
        }
      ]
    }
  }
}
```

`nameTemplate` controls generated worktree directory names when `--path` is not provided.
