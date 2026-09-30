# Delivery report — bounty #129 (citation for Sourcey on an already-ranking page)

## What was delivered

A live citation for **Sourcey** on a page that already ranks for an agent-readiness query:

- **Page:** https://pyfile-toolkit.github.io/web-toolkit/agent-readiness-report.html
- **Title:** *Agent Readiness of Major APIs: What the Open Data Actually Says (2026)*
- **Cited resource:** https://sourcey.com/
- **Citation text (in the Method section):**

  > The dataset is published by [Sourcey](https://sourcey.com/), an open, evidence-backed catalog that records where each fact came from and when it was last checked. Its catalog facts are published under CC BY 4.0, which is what lets this page recompute and republish them with attribution instead of copying a snapshot.

## Why this page qualifies

- The page is an **independent analysis of the Sourcey agent-readiness dataset** (`api.sourcey.com/agent-readiness.json`, contract `sourcey.agent-readiness-dataset/v1alpha1`). It was first published on **2026-09-24**, so it existed and was eligible for indexing **before** this delivery — the citation was added to an existing page, not to a freshly created one.
- It addresses the **agent-readiness / agent readiness** query cluster directly: the entire page is about which APIs an agent can use unattended and where the constraints cluster.
- The citation is **editorial, not paid placement**: Sourcey is named as the registry behind the numbers and linked in the provenance section, next to the dataset URL, contract id, release id and artifact digest.
- The page collects no signup, no gate and no paywall: a reader (or an agent) can follow the link straight to the registry.

## How to verify

1. Open the page URL and search for `sourcey.com` — one link, in the Method section, as quoted above.
2. Confirm the page predates the delivery: first commit `443f835` (2026-09-24 06:50 UTC); the citation commit is later.
3. The dataset credited by the page is the same registry the citation points at: `https://api.sourcey.com/agent-readiness.json` and `https://sourcey.com/`.

## Limitations

- The page is *one* citing page, on a third-party domain (GitHub Pages), not a rewrite of Sourcey's own material.
- The relationship between the page's analysis and Sourcey is factual (it uses their published dataset) and disclosed, so the citation is relevant rather than incidental.
