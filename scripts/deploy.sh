#!/bin/bash
set -euo pipefail

echo "🧪 Installing dependencies..."
npm install

echo "🚀 Starting listener (index.ts)..."
npm run start &

echo "⚡ Sending Flashbots bundle (bundle.ts)..."
sleep 5
npm run bundle
