#!/bin/bash
# Install techprobe to /usr/local/bin

set -e

echo "Building techprobe..."
cargo build --release

echo "Installing to /usr/local/bin..."
sudo cp target/release/techprobe /usr/local/bin/

echo "Installation complete!"
echo "Run 'techprobe --help' to get started."
