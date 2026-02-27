# AGENTS

## Test Requirements
- Every behavior change must include tests.
- Every new module must include at least one focused unit test.
- Bug fixes must include regression tests that fail before the fix and pass after.
- CLI behavior changes should have command-level tests where practical.
- TUI interaction logic should be extracted into testable helpers and covered by unit tests.

## Minimum Verification Before Hand-off
- Run `bun test`.
- Run `bunx tsc --noEmit`.
- If command behavior changed, run at least one smoke command (for example `bun run src/index.tsx --help`).

## Testing Style
- Prefer deterministic tests with temporary directories over environment-dependent behavior.
- Mock external side effects (git/process/home/config IO boundaries) when unit-testing orchestration.
- Keep tests small and behavior-oriented; avoid snapshot-heavy tests for core logic.
