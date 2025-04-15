import { test, chromium, Page } from "@playwright/test";

export const testWithZoomExtension = test.extend({
  context: async ({ context }, use) => {
    const pathToExtension = require("path").join(__dirname, "/zoom-extension");
    const contextWithExtension = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await contextWithExtension.addCookies(await context.cookies());
    try {
      let pageWithExntesionToClose: Page | undefined =
        contextWithExtension.pages()[0];
      contextWithExtension.on("page", async () => {
        await pageWithExntesionToClose?.close();
        pageWithExntesionToClose = undefined;
      });
    } catch (error) {
      console.error("Could not close the extension loading first tab:", error);
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
 * Setting the browser zoom is only available in Chrome. To set the zoom the Playwright Zoom Extension has to be loaded in the test browser by using the testWithZoomExtension.
 *
 * @param zoom Browser zoom to set in Chrome
 */
export async function setBrowserZoom(page: Page, zoom: number) {
  await page.evaluate(
    (browserZoom) =>
      window.postMessage({ type: "setTabZoom", browserZoom }, "*"),
    zoom
  );
}
