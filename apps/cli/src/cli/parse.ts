import { ValidationError } from "../core/errors";
import { runCreateCommand } from "./commands/create";
import { runDeleteCommand } from "./commands/delete";
import { runListCommand } from "./commands/list";
import {
  runRepoAddCommand,
  runRepoListCommand,
  runRepoRemoveCommand,
  runRepoSetCopyCommand,
  runRepoUseCommand,
} from "./commands/repo";

function getVersion(): string {
  return process.env.BWT_VERSION ?? process.env.npm_package_version ?? "0.0.0-dev";
}

type ParsedFlags = Record<string, string | boolean | string[]>;

function assignFlag(flags: ParsedFlags, key: string, value: string | boolean) {
  const existing = flags[key];
  if (existing === undefined) {
    flags[key] = value;
    return;
  }

  if (typeof existing === "string" && typeof value === "string") {
    flags[key] = [existing, value];
    return;
  }

  if (Array.isArray(existing) && typeof value === "string") {
    flags[key] = [...existing, value];
    return;
  }

  flags[key] = value;
}

function parseFlags(parts: string[]): { positional: string[]; flags: ParsedFlags } {
  const positional: string[] = [];
  const flags: ParsedFlags = {};

  for (let i = 0; i < parts.length; i += 1) {
    const token = parts[i];
    if (!token) {
      continue;
    }
    if (!token.startsWith("-")) {
      positional.push(token);
      continue;
    }

    const key = token.replace(/^-+/, "");
    const next = parts[i + 1];
    if (next && !next.startsWith("-")) {
      assignFlag(flags, key, next);
      i += 1;
    } else {
      assignFlag(flags, key, true);
    }
  }

  return { positional, flags };
}

function getStringFlag(flags: ParsedFlags, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = flags[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return undefined;
}

function getBooleanFlag(flags: ParsedFlags, ...keys: string[]): boolean {
  return keys.some((key) => flags[key] === true);
}

function printHelp() {
  console.log(`bwt - Better WorkTree\n
Usage:
  bwt                       Launch TUI
  bwt --version             Show version
  bwt list [-R <repo>] [--json]
  bwt create <name> [-R <repo>] [--branch <branch>] [--base <base>] [--path <dir>] [--json]
  bwt delete <target> [-R <repo>] [--yes] [--force]
  bwt repo list
  bwt repo add <path> [--name <alias>]
  bwt repo remove <path>
  bwt repo use <path>
  bwt repo set-copy <repo> --rule <from[:to]> [--rule <from[:to]> ...]
`);
}

function parseCopyRules(flags: ParsedFlags): Array<{ from: string; to?: string }> {
  const raw = flags.rule;
  if (!raw) {
    return [];
  }

  const values = Array.isArray(raw) ? raw : [raw];
  const rules: Array<{ from: string; to?: string }> = [];
  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const [from, to] = value.split(":");
    if (!from) {
      continue;
    }
    rules.push({ from, to });
  }

  return rules;
}

export async function runCli(argv: string[]) {
  const [command, ...rest] = argv;
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    console.log(getVersion());
    return;
  }

  if (command === "list") {
    const { flags } = parseFlags(rest);
    await runListCommand({
      repo: getStringFlag(flags, "R", "repo"),
      json: getBooleanFlag(flags, "json"),
    });
    return;
  }

  if (command === "create") {
    const { positional, flags } = parseFlags(rest);
    if (!positional[0]) {
      throw new ValidationError("Usage: bwt create <name>");
    }
    await runCreateCommand({
      name: positional[0],
      repo: getStringFlag(flags, "R", "repo"),
      branch: getStringFlag(flags, "branch"),
      base: getStringFlag(flags, "base"),
      path: getStringFlag(flags, "path"),
      json: getBooleanFlag(flags, "json"),
    });
    return;
  }

  if (command === "delete") {
    const { positional, flags } = parseFlags(rest);
    if (!positional[0]) {
      throw new ValidationError("Usage: bwt delete <target>");
    }
    await runDeleteCommand({
      target: positional[0],
      repo: getStringFlag(flags, "R", "repo"),
      force: getBooleanFlag(flags, "force"),
      yes: getBooleanFlag(flags, "yes", "y"),
    });
    return;
  }

  if (command === "repo") {
    const [repoCommand, ...repoRest] = rest;
    if (!repoCommand) {
      throw new ValidationError("Usage: bwt repo <list|add|remove|use|set-copy>");
    }

    if (repoCommand === "list") {
      await runRepoListCommand();
      return;
    }

    if (repoCommand === "add") {
      const { positional, flags } = parseFlags(repoRest);
      if (!positional[0]) {
        throw new ValidationError("Usage: bwt repo add <path>");
      }
      await runRepoAddCommand(positional[0], getStringFlag(flags, "name"));
      return;
    }

    if (repoCommand === "remove") {
      const { positional } = parseFlags(repoRest);
      if (!positional[0]) {
        throw new ValidationError("Usage: bwt repo remove <path>");
      }
      await runRepoRemoveCommand(positional[0]);
      return;
    }

    if (repoCommand === "use") {
      const { positional } = parseFlags(repoRest);
      if (!positional[0]) {
        throw new ValidationError("Usage: bwt repo use <path>");
      }
      await runRepoUseCommand(positional[0]);
      return;
    }

    if (repoCommand === "set-copy") {
      const { positional, flags } = parseFlags(repoRest);
      if (!positional[0]) {
        throw new ValidationError("Usage: bwt repo set-copy <path> --rule <from[:to]>");
      }
      const rules = parseCopyRules(flags);
      if (rules.length === 0) {
        throw new ValidationError("At least one --rule is required");
      }
      await runRepoSetCopyCommand(positional[0], rules);
      return;
    }

    throw new ValidationError(`Unknown repo command: ${repoCommand}`);
  }

  throw new ValidationError(`Unknown command: ${command}`);
}
