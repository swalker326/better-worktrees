import process from "node:process";

function hasGlibc(report = process.report?.getReport?.()) {
  const glibcVersion = report?.header?.glibcVersionRuntime;
  return typeof glibcVersion === "string" && glibcVersion.length > 0;
}

export function isMusl(report = process.report?.getReport?.()) {
  if (process.platform !== "linux") {
    return false;
  }

  return !hasGlibc(report);
}

export function resolvePlatformPackage(
  platform = process.platform,
  arch = process.arch,
  musl = isMusl(),
) {
  if (platform === "darwin" && arch === "arm64") {
    return { packageName: "better-worktree-darwin-arm64", binaryName: "bwt" };
  }

  if (platform === "darwin" && arch === "x64") {
    return { packageName: "better-worktree-darwin-x64", binaryName: "bwt" };
  }

  if (platform === "linux" && arch === "arm64") {
    const suffix = musl ? "-musl" : "";
    return {
      packageName: `better-worktree-linux-arm64${suffix}`,
      binaryName: "bwt",
    };
  }

  if (platform === "linux" && arch === "x64") {
    const suffix = musl ? "-musl" : "";
    return {
      packageName: `better-worktree-linux-x64${suffix}`,
      binaryName: "bwt",
    };
  }

  if (platform === "win32" && arch === "arm64") {
    return {
      packageName: "better-worktree-windows-arm64",
      binaryName: "bwt.exe",
    };
  }

  if (platform === "win32" && arch === "x64") {
    return {
      packageName: "better-worktree-windows-x64",
      binaryName: "bwt.exe",
    };
  }

  throw new Error(
    `Unsupported platform/architecture: ${platform}/${arch}. ` +
      "Please open an issue for support.",
  );
}
