import { test, chromium, Page } from "@playwright/test";

export type PathsToCustomExtensions = {
  /**
   * Optional array of absolute paths to custom browser extensions.
   */
  pathsToCustomExtensions?: string[];
};

/**
 * A Playwright test extension that integrates the Playwright Zoom Extension into the browser context.
 * This allows tests to set and manipulate browser zoom levels to replicate real user experience.
 *
 * The custom test type extends Playwright's behavior by launching a persistent Chromium context
 * with the required browser extension preloaded. It ensures the test context is properly initialized
 * with cookies and manages cleanup tasks after each test run.
 *
 * Additionally, users can load custom browser extensions by specifying their absolute paths in the Playwright configuration.
 *
 * @example Basic Zoom Functionality
 * import { setBrowserZoom, testWithZoomExtension as test } from 'playwright-zoom';
 *
 * test('Zoom Test Example', async ({ page }) => {
 *   // Set the browser zoom level
 *   await setBrowserZoom(page, 200);
 *   console.log('Zoom level set to 200%');
 * });
 *
 * @example Configuring Custom Extensions
 * import { defineConfig, devices } from '@playwright/test';
 * import type { PathsToCustomExtensions } from 'playwright-zoom';
 *
 * export default defineConfig<PathsToCustomExtensions>({
 *   projects: [
 *     {
 *       name: 'chromium',
 *       use: {
 *         ...devices['Desktop Chrome'],
 *         pathsToCustomExtensions: [
 *           '/absolute/path/to/custom-extension-1',
 *           '/absolute/path/to/custom-extension-2'
 *         ],
 *       },
 *     },
 *   ],
 * });
 *
 * @extends {import('@playwright/test').TestType}
 */
export const testWithZoomExtension = test.extend<PathsToCustomExtensions>({
  pathsToCustomExtensions: [undefined, { option: true }],
  context: async ({ context, pathsToCustomExtensions }, use) => {
    const pathToZoomExtension = require("path").join(
      __dirname,
      "/zoom-extension"
    );
    const joinedPaths = pathsToCustomExtensions
      ? `${pathToZoomExtension},${pathsToCustomExtensions.join()}`
      : pathToZoomExtension;
    const contextWithExtension = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${joinedPaths}`,
        `--load-extension=${joinedPaths}`,
      ],
    });
    await contextWithExtension.addCookies(await context.cookies());
    try {
      let pageWithExntesionToClose: Page | undefined =
        contextWithExtension.pages()[0];
      contextWithExtension.on("page", async () => {
        await pageWithExntesionToClose?.close(); // the extension opens a tab upon load
        pageWithExntesionToClose = undefined;
      });
    } catch (error) {
      console.error(
        "Failed to close the first tab after initializing the extension:",
        error
      );
    }
    await use(contextWithExtension);
    try {
      await contextWithExtension.close();
    } catch (error) {
      console.error("Cannot close context:", error);
    }
  },
});

/**
 * Sets the browser zoom in a Chrome instance using the Playwright Zoom Extension.
 *
 * Note: This function only works if the browser is launched with the `testWithZoomExtension`.
 *
 * @param page The Playwright Page object.
 * @param zoom The zoom level to set (e.g., 150 for 150%).
 */
export async function setBrowserZoom(page: Page, zoom: number) {
  await page.evaluate(
    (browserZoom) =>
      window.postMessage({ type: "setTabZoom", browserZoom }, "*"),
    zoom
  );
}
