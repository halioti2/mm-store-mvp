#!/usr/bin/env bash
set -euo pipefail

# unpack-storage.sh
# Unpack any storage zip files found in the SCHEMA_FOLDER to out/storage/

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA_DIR=${SCHEMA_FOLDER:-"$ROOT_DIR/schema"}
OUT_DIR="$ROOT_DIR/out/storage"

mkdir -p "$OUT_DIR"

for z in "$SCHEMA_DIR"/*.storage.zip; do
  [ -e "$z" ] || continue
  echo "Unpacking $z -> $OUT_DIR"
  unzip -o "$z" -d "$OUT_DIR"
done

echo "Done. Files extracted to $OUT_DIR"
