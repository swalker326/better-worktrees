# Contributing

Thanks for contributing to better-worktree.

## Local setup

```bash
git clone <repo-url>
cd better-worktree
bun install
```

## Run locally

```bash
bun run start
```

No arguments opens the TUI. Commands run in one-off CLI mode.

### Run docs site

```bash
bun run docs:dev
```

## Required verification before hand-off

```bash
bun test
bunx tsc --noEmit
```

If command behavior changed, also run a smoke command such as:

```bash
bun run src/index.tsx --help
```

## Testing expectations

- Every behavior change includes tests.
- Every new module includes at least one focused unit test.
- Bug fixes include regression tests that fail before the fix and pass after.
- CLI behavior changes should include command-level tests where practical.
- TUI interaction logic should be extracted into testable helpers and covered by unit tests.

## CI and releases

- PRs and pushes to `main` run `.github/workflows/ci.yml`.
- Tagging `vX.Y.Z` runs `.github/workflows/release.yml`, validates the project, builds cross-platform binaries, publishes platform packages, then publishes `better-worktree`.
- Releases use npm Trusted Publishing (GitHub OIDC), so no `NPM_TOKEN` secret is required.

## Local release helpers

- `./scripts/publish-packages.sh --dry-run`: build binaries and dry-run publish all packages.
- `./scripts/publish-packages.sh`: build binaries and publish all packages from local machine.
- `./scripts/release-version.sh 0.1.1`: bump publish package versions, commit, tag, and push.
