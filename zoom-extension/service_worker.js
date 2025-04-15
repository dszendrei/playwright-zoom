console.log("Service worker for Playwright Zoom Extension is loaded");

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.command === "setTabZoom") {
    const browserZoom = parseInt(request.browserZoom);
    chrome.tabs.query(
      { active: true, currentWindow: true, highlighted: true },
      async (tabs) => {
        let currTabId = tabs[0].id;
        chrome.tabs.setZoom(currTabId, browserZoom / 100).then(
          async () => {
            const settings = await chrome.tabs.getZoom();
            console.log("Current zoom settings are modified to:", settings);
            sendResponse("OK");
          },
          (e) => console.log(e)
        );
      }
    );
  }
  return true;
});
