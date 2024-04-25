#!/bin/sh

echo "Copy api gens"

mkdir -p dist/apps/bigration-engine/interfaces/studio-api-interface/dist

cp -a interfaces/studio-api-interface/dist/. dist/apps/bigration-engine/interfaces/studio-api-interface/dist/

echo "Installing dependencies for the engine"

pnpm --prefix dist/apps/bigration-engine install --production
