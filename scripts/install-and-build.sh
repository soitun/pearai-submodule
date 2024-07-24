#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension

# Exit immediately if a command exits with a non-zero status
set -e

echo "Building VSCode extension..."
pushd extensions/vscode
npm run tsc
node scripts/prepackage.js
npm run esbuild
popd

echo "Building GUI..."
pushd gui
npm run build
popd

# Inform the user that the build is complete
echo "Build process complete."
