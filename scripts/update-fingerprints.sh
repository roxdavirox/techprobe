#!/bin/bash
# Script to update techprobe fingerprints from Wappalyzer/webappanalyzer

set -e

REPO_URL="https://github.com/enthec/webappanalyzer"
DATA_DIR="$(dirname "$0")/data"

echo "Updating fingerprints from $REPO_URL..."

TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

git clone --depth 1 "$REPO_URL" .
cp src/technologies/*.json "$DATA_DIR/technologies_raw.json" 2>/dev/null || true

# Merge all technology files into one
if [ -d "src/technologies" ]; then
    echo "Merging technology files..."
    python3 -c "
import json
import os
import glob

merged = {}
for f in glob.glob('src/technologies/*.json'):
    with open(f) as fh:
        data = json.load(fh)
        merged.update(data)

with open('$DATA_DIR/technologies.json', 'w') as out:
    json.dump(merged, out, indent=2)
"
fi

# Copy categories
if [ -f "src/categories.json" ]; then
    cp src/categories.json "$DATA_DIR/categories.json"
fi

cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "Fingerprints updated successfully!"
echo "Technologies: $(python3 -c "import json; print(len(json.load(open('$DATA_DIR/technologies.json'))))" 2>/dev/null || echo 'unknown')"
