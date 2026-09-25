# Web Dev Toolkit — 66 free browser tools

Everything runs locally in your browser, nothing is uploaded. SEO-friendly, light, no frameworks, fully open source.

**Live:** https://pyfile-toolkit.github.io/web-toolkit/

## What's inside
- 66 instant tools: encoders/decoders, generators (UUID v4/v7, password, lorem, random, barcode EAN-13), formatters (JSON, SQL, XML, markdown table), checkers (contrast, password strength, HTTP status), hash (MD5/SHA1/SHA256), JWT decoder, regex tester, diff checkers (text, JSON), CSS utilities (gradient, box-shadow), HTML minifier, converters (case, CSV↔JSON, color, unix time), games (reaction, simon, typing test, word puzzle, pomodoro) and more.
- Guides (SEO content): Base64, YAML vs JSON, MD5 vs SHA256, WCAG contrast, and "Accept Lightning Payments on a Static Site".
- Monetized landing: **LLM API Access** (pay per request in USDC via x402 or Nano, no signup, no key, no KYC) → `llm-api.html`. Live endpoint: `https://pyfile-agent.taile3ff35.ts.net` (`GET /` descriptor, `GET /v1/models` catalog, unpaid `POST` → full 402 terms).

## Stack
Static HTML/CSS/JS on GitHub Pages. Tool logic lives in `scripts/*.js` (UMD libs, node-testable: `node scripts/test-*.js`), each page renders in headless Chromium before deploy.

## Recent additions
- JSON Diff (leaf-level diff with sorted paths)
- EAN-13 Barcode Generator
- Markdown Table Generator, UUID v4/v7, URL Encoder/Decoder
- Guide: [Accept Lightning Payments](https://pyfile-toolkit.github.io/web-toolkit/guides/lnd-payments-guide.html)

## Consuming the LLM API
OpenAI-compatible `/v1` endpoint; flat 0.005 USDC (x402) or 0.001 XNO (Nano) per request. No account, no API key — the 402 response carries the payment terms. Details on the landing page.

License: MIT. Built by pyfile-toolkit.
