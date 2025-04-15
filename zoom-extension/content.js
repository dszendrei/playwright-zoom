window.addEventListener(
  "message",
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;
    if (event.data.type && event.data.type === "setTabZoom") {
      setBrowserZoom(event.data.browserZoom);
    }
  },
  false
);

function setBrowserZoom(browserZoom) {
  if (browserZoom && Number.isInteger(browserZoom)) {
    chrome.runtime.sendMessage(
      { command: "setTabZoom", browserZoom: browserZoom },
      function (_response) {
        if (tab.url.startsWith("chrome://")) return undefined;
      }
    );
  }
}
