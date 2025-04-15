# Playwright Zoom

**Playwright Zoom** is a TypeScript library designed to enhance Playwright with real browser zooming functionality, leveraging the Playwright Zoom Extension. This library provides an easy and reliable way to manipulate browser zoom levels in your end-to-end testing workflows.

---

## Features

- Seamless integration with Playwright for browser zooming.
- Uses the **Playwright Zoom Extension** to ensure accurate zoom functionality across supported browsers.
- Fully compatible with modern Node.js and TypeScript projects.
- Supports adjustable zoom levels for testing responsive designs and accessibility.
- Load custom browser extensions alongside the Playwright Zoom Extension for additional flexibility.

---

## Limitations

- Only works with Chromium, since it relies on a Chrome extension.

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

I recommend this trick to make the syntax simpler:

```typescript
import { setBrowserZoom, testWithZoomExtension as test } from "playwright-zoom";
```

## Custom Extensions

Playwright Zoom also supports loading custom browser extensions alongside the Playwright Zoom Extension. This allows you to integrate additional extensions into your Playwright tests. (Since 1.1.0)

### Configuring Custom Extensions

You can specify the paths to custom extensions in the Playwright configuration file. Use the pathsToCustomExtensions option, which is part of the PathsToCustomExtensions type provided by the library:

```typescript
import { defineConfig, devices } from "@playwright/test";
import type { PathsToCustomExtensions } from "playwright-zoom";

export default defineConfig<PathsToCustomExtensions>({
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        pathsToCustomExtensions: [
          "/absolute/path/to/custom-extension-1",
          "/absolute/path/to/custom-extension-2",
        ],
      },
    },
  ],
});
```
