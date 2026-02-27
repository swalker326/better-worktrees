export class BwtError extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = "BwtError";
    this.code = code;
    this.details = details;
  }
}

export class RepoResolutionError extends BwtError {
  constructor(message: string, details?: string) {
    super("REPO_RESOLUTION_ERROR", message, details);
  }
}

export class ConfigError extends BwtError {
  constructor(message: string, details?: string) {
    super("CONFIG_ERROR", message, details);
  }
}

export class GitCommandError extends BwtError {
  constructor(message: string, details?: string) {
    super("GIT_COMMAND_ERROR", message, details);
  }
}

export class ValidationError extends BwtError {
  constructor(message: string, details?: string) {
    super("VALIDATION_ERROR", message, details);
  }
}

export function formatError(error: unknown): string {
  if (error instanceof BwtError) {
    return error.details ? `${error.message}: ${error.details}` : error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
