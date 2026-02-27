import { mkdir } from "node:fs/promises";

const entry = "apps/cli/src/index.tsx";

const targets = [
  {
    target: "bun-darwin-arm64",
    outdir: "packages/better-worktree-darwin-arm64/bin",
    outfile: "bwt",
  },
  {
    target: "bun-darwin-x64",
    outdir: "packages/better-worktree-darwin-x64/bin",
    outfile: "bwt",
  },
  {
    target: "bun-linux-arm64",
    outdir: "packages/better-worktree-linux-arm64/bin",
    outfile: "bwt",
  },
  {
    target: "bun-linux-arm64-musl",
    outdir: "packages/better-worktree-linux-arm64-musl/bin",
    outfile: "bwt",
  },
  {
    target: "bun-linux-x64",
    outdir: "packages/better-worktree-linux-x64/bin",
    outfile: "bwt",
  },
  {
    target: "bun-linux-x64-musl",
    outdir: "packages/better-worktree-linux-x64-musl/bin",
    outfile: "bwt",
  },
  {
    target: "bun-windows-arm64",
    outdir: "packages/better-worktree-windows-arm64/bin",
    outfile: "bwt.exe",
  },
  {
    target: "bun-windows-x64",
    outdir: "packages/better-worktree-windows-x64/bin",
    outfile: "bwt.exe",
  },
];

for (const item of targets) {
  await mkdir(item.outdir, { recursive: true });
  const outfile = `${item.outdir}/${item.outfile}`;
  console.log(`Building ${item.target} -> ${outfile}`);
  await Bun.$`bun build --compile --target=${item.target} ${entry} --outfile ${outfile}`;
}

console.log("Built all platform binaries.");
