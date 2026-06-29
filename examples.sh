#!/bin/bash
# Example usage of techprobe

echo "=== techprobe usage examples ==="
echo ""

echo "1. Scan a single website:"
echo "   techprobe scan example.com"
echo ""

echo "2. Scan multiple websites:"
echo "   techprobe scan site1.com site2.com site3.com"
echo ""

echo "3. Output as JSON:"
echo "   techprobe scan -f json example.com"
echo ""

echo "4. Save results to file:"
echo "   techprobe scan -o results.json example.com"
echo ""

echo "5. Follow redirects:"
echo "   techprobe scan --follow-redirects example.com"
echo ""

echo "6. List all technologies:"
echo "   techprobe list"
echo ""

echo "7. Filter by category:"
echo "   techprobe list -c cms"
echo ""

echo "8. Search for a technology:"
echo "   techprobe list -s wordpress"
echo ""

echo "=== Quick test ==="
echo "Scanning example.com..."
./target/release/techprobe scan example.com
