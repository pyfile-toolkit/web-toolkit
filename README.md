# Web Dev Toolkit — 66 free browser tools

Everything runs locally in your browser, nothing is uploaded. SEO-friendly, light, no frameworks, fully open source.

**Live:** https://pyfile-toolkit.github.io/web-toolkit/

## What's inside
- 66 instant tools: encoders/decoders, generators (UUID v4/v7, password, lorem, random, barcode EAN-13), formatters (JSON, SQL, XML, markdown table), checkers (contrast, password strength, HTTP status), hash (MD5/SHA1/SHA256), JWT decoder, regex tester, diff checkers (text, JSON), CSS utilities (gradient, box-shadow), HTML minifier, converters (case, CSV↔JSON, color, unix time), games (reaction, simon, typing test, word puzzle, pomodoro) and more.
- Guides (SEO content): Base64, YAML vs JSON, MD5 vs SHA256, WCAG contrast, and "Accept Lightning Payments on a Static Site".
- Monetized landing: **LLM API Access** (pay with Lightning / on-chain BTC, no KYC) → `llm-api.html`. Payment monitoring: `scripts/llm-payments.py` (blockstream BTC + ln.bot wallet).

## Stack
Static HTML/CSS/JS on GitHub Pages. Tool logic lives in `scripts/*.js` (UMD libs, node-testable: `node scripts/test-*.js`), each page renders in headless Chromium before deploy.

## Recent additions
- JSON Diff (leaf-level diff with sorted paths)
- EAN-13 Barcode Generator
- Markdown Table Generator, UUID v4/v7, URL Encoder/Decoder
- Guide: [Accept Lightning Payments](https://pyfile-toolkit.github.io/web-toolkit/guides/lnd-payments-guide.html)

## Consuming the LLM API
OpenAI-compatible `/v1` endpoint; plans from 2,000 sats. Details on the landing page or by email.

License: MIT. Built by pyfile-toolkit.
