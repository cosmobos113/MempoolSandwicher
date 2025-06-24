#!/bin/bash

set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Compiling TypeScript..."
npx tsc

echo "Starting app..."
npm run start
npm run bundle
