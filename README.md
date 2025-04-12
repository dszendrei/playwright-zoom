# Playwright Zoom

**Playwright Zoom** is a TypeScript library designed to enhance Playwright with real browser zooming functionality, leveraging the Playwright Zoom Extension. This library provides an easy and reliable way to manipulate browser zoom levels in your end-to-end testing workflows.

---

## Features

- Seamless integration with Playwright for browser zooming.
- Uses the **Playwright Zoom Extension** to ensure accurate zoom functionality across supported browsers.
- Fully compatible with modern Node.js and TypeScript projects.
- Supports adjustable zoom levels for testing responsive designs and accessibility.

---

## Limitations

- only works with Chromium, since it is using a Chrome extension.

---

## Installation

First, install the library via npm:

```bash
npm install playwright-zoom
```

---

## Usage

```typescript
import { expect } from "@playwright/test";
import { setBrowserZoom, testWithZoomExtension } from "playwright-zoom";

testWithZoomExtension(
  "just an example: has correct title after changing browser zoom, ",
  async ({ page }) => {
    await page.goto("/");

    await setBrowserZoom(page, 125);

    await expect(page).toHaveTitle(/TestApp/);
  }
);
```

I would recommend this trick to make it nicer to use:

```typescript
import { setBrowserZoom, testWithZoomExtension as test } from "playwright-zoom";
```
