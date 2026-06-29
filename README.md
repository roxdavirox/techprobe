# techprobe

High-performance web technology detector — Rust alternative to Wappalyzer.

Detects technologies used on websites by analyzing HTTP headers, HTML content, meta tags, cookies, JavaScript files, and more.

## Features

- **Fast**: Written in Rust with async I/O for high-performance scanning
- **Chrome Extension**: Browser extension for real-time detection
- **Compatible**: Uses the same fingerprint format as Wappalyzer
- **Multiple output formats**: Text, JSON, and CSV
- **Concurrent scanning**: Scan multiple URLs simultaneously
- **Extensible**: Easy to add new technology fingerprints

## Installation

### CLI (Rust)

```bash
cargo build --release
```

The binary will be at `target/release/techprobe`.

### Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

The extension will detect technologies on any website you visit and show a badge with the count.

## Usage

### Scan websites

```bash
# Scan a single website
techprobe scan example.com

# Scan multiple websites
techprobe scan site1.com site2.com site3.com

# Output as JSON
techprobe scan -F json example.com

# Save results to file
techprobe scan -o results.json example.com

# Follow redirects
techprobe scan --follow-redirects example.com
```

### List technologies

```bash
# List all technologies
techprobe list

# Filter by category
techprobe list -c cms

# Search for a technology
techprobe list -s wordpress
```

## Output Formats

### Text (default)
```
Target: https://example.com
────────────────────────────────────────────────────────────
  ● WordPress v6.4 — CMS, Blogs
  ● PHP v8.2 — Programming Languages
  ● Nginx v1.24 — Web Servers

→ 3 technologies detected
```

### JSON
```json
[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "name": "WordPress",
        "version": "6.4",
        "confidence": 100,
        "categories": ["CMS", "Blogs"]
      }
    ],
    "headers": {...},
    "status": 200,
    "elapsed_ms": 245
  }
]
```

### CSV
```csv
url,technology,version,confidence,categories
https://example.com,WordPress,6.4,100,CMS;Blogs
```

## Detection Methods

- **HTTP Headers**: Server, X-Powered-By, Set-Cookie, etc.
- **HTML Content**: Script tags, link tags, CSS classes
- **Meta Tags**: Generator, other meta information
- **Cookies**: Session cookies, tracking cookies
- **JavaScript**: Library detection via global variables
- **URL Patterns**: Domain-based detection

## Fingerprint Database

The fingerprint database is in `data/technologies.json` and follows the Wappalyzer format. Each technology entry can include:

- `description`: Short description
- `cats`: Category IDs
- `website`: Official website URL
- `headers`: HTTP header patterns
- `meta`: Meta tag patterns
- `cookies`: Cookie patterns
- `scriptSrc`: Script URL patterns
- `scripts`: Inline script patterns
- `html`: HTML content patterns
- `js`: JavaScript property patterns
- `implies`: Other technologies that are implied
- `requires`: Technologies that must be detected first

## Adding New Technologies

Edit `data/technologies.json` and add a new entry:

```json
{
  "MyFramework": {
    "description": "A cool web framework",
    "cats": [18],
    "website": "https://myframework.dev",
    "headers": {
      "x-powered-by": "MyFramework"
    },
    "scriptSrc": [
      "myframework\\.js"
    ]
  }
}
```

## Comparison with Wappalyzer

| Feature | techprobe | Wappalyzer |
|---------|-----------|------------|
| Language | Rust + JS | JavaScript |
| Performance | High | Medium |
| CLI | Native | Node.js |
| Browser Extension | Yes | Yes |
| API | CLI-based | Web API |
| Fingerprint Format | Compatible | Original |
| Open Source | MIT | GPL-3.0 |

## License

MIT
