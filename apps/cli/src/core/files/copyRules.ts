import { cp, stat } from "node:fs/promises";
import path from "node:path";

import type { CopyRule } from "../types";

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .replace(/[\\/]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

export function resolveNameTemplate(
  template: string,
  projectName: string,
  branchName: string,
): string {
  return template
    .replaceAll("<project_name>", sanitizeSegment(projectName))
    .replaceAll("<branch_name>", sanitizeSegment(branchName));
}

export async function applyCopyRules(
  repoPath: string,
  worktreePath: string,
  rules: CopyRule[],
): Promise<{ copied: string[]; warnings: string[] }> {
  const copied: string[] = [];
  const warnings: string[] = [];

  for (const rule of rules) {
    const from = path.resolve(repoPath, rule.from);
    const to = path.resolve(worktreePath, rule.to ?? rule.from);
    const overwrite = Boolean(rule.overwrite);

    try {
      await stat(from);
    } catch {
      if (rule.required) {
        throw new Error(`Required copy source is missing: ${rule.from}`);
      }
      warnings.push(`Skipped missing file: ${rule.from}`);
      continue;
    }

    await cp(from, to, {
      force: overwrite,
      errorOnExist: !overwrite,
      recursive: true,
    });
    copied.push(`${rule.from} -> ${rule.to ?? rule.from}`);
  }

  return { copied, warnings };
}
