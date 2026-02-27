#!/usr/bin/env bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.1"
  exit 1
fi

VERSION="$1"
TAG="v${VERSION}"

if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.][0-9A-Za-z.-]+)?$ ]]; then
  echo "Invalid version: ${VERSION}"
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "Run this script from the repository root."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or stash changes first."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "Expected to run on main, current branch is: ${BRANCH}"
  exit 1
fi

if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
  echo "Tag already exists locally: ${TAG}"
  exit 1
fi

if git ls-remote --exit-code --tags origin "refs/tags/${TAG}" >/dev/null 2>&1; then
  echo "Tag already exists on origin: ${TAG}"
  exit 1
fi

PACKAGE_FILES=(
  "packages/better-worktree/package.json"
  "packages/better-worktree-darwin-arm64/package.json"
  "packages/better-worktree-darwin-x64/package.json"
  "packages/better-worktree-linux-arm64/package.json"
  "packages/better-worktree-linux-arm64-musl/package.json"
  "packages/better-worktree-linux-x64/package.json"
  "packages/better-worktree-linux-x64-musl/package.json"
  "packages/better-worktree-windows-arm64/package.json"
  "packages/better-worktree-windows-x64/package.json"
)

for file in "${PACKAGE_FILES[@]}"; do
  NEW_VERSION="$VERSION" PACKAGE_FILE="$file" node --input-type=module -e '
    import fs from "node:fs";
    const file = process.env.PACKAGE_FILE;
    const version = process.env.NEW_VERSION;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.version = version;

    if (file === "packages/better-worktree/package.json" && data.optionalDependencies) {
      for (const key of Object.keys(data.optionalDependencies)) {
        if (key.startsWith("better-worktree-")) {
          data.optionalDependencies[key] = version;
        }
      }
    }

    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  '
done

git add "${PACKAGE_FILES[@]}"
git commit -m "chore: release ${TAG}"
git tag "${TAG}"
git push origin main
git push origin "${TAG}"

echo "Released ${TAG}"
