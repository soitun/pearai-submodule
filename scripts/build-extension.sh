#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change to the VS Code extension directory and build
cd extensions/vscode
npm run tsc
node scripts/prepackage.js
npm run esbuild
cd -

# Change to the GUI directory and build
cd gui
npm run build
cd -

# Inform the user that the build is complete
echo "Build process complete."