import { GitCommandError } from "../errors";

export type GitResult = {
  stdout: string;
  stderr: string;
};

export async function runGit(
  args: string[],
  cwd: string,
): Promise<GitResult> {
  const proc = Bun.spawn(["git", ...args], {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (code !== 0) {
    throw new GitCommandError(
      `git ${args.join(" ")} failed`,
      stderr.trim() || stdout.trim() || `exit code ${code}`,
    );
  }

  return { stdout, stderr };
}
