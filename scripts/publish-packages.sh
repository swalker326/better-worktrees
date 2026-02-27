#!/usr/bin/env bash

set -euo pipefail

DRY_RUN=false
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
fi

if [ ! -f "package.json" ]; then
  echo "Run this script from the repository root."
  exit 1
fi

PACKAGES=(
  "packages/better-worktree-darwin-arm64"
  "packages/better-worktree-darwin-x64"
  "packages/better-worktree-linux-arm64"
  "packages/better-worktree-linux-arm64-musl"
  "packages/better-worktree-linux-x64"
  "packages/better-worktree-linux-x64-musl"
  "packages/better-worktree-windows-arm64"
  "packages/better-worktree-windows-x64"
  "packages/better-worktree"
)

echo "Logging into npm (interactive)..."
npm login

echo "Installing dependencies for all target OS/CPU combinations..."
bun install --os '*' --cpu '*'

echo "Building binaries..."
bun run build:binaries

PUBLISH_FLAGS=(--provenance --access public)
if [ "${GITHUB_ACTIONS:-}" != "true" ]; then
  PUBLISH_FLAGS=(--access public)
  echo "Local environment detected: publishing without --provenance."
fi

if [ "$DRY_RUN" = true ]; then
  PUBLISH_FLAGS+=(--dry-run)
  echo "Dry run enabled: npm publish will not upload packages."
fi

echo "Publishing packages..."
for package in "${PACKAGES[@]}"; do
  echo "Publishing ${package}"
  npm publish "${PUBLISH_FLAGS[@]}" --workspace "${package}"
done

if [ "$DRY_RUN" = true ]; then
  echo "Dry run complete."
else
  echo "Done. All packages published."
fi
