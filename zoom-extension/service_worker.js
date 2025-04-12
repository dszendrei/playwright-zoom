console.log('Service worker is loaded');

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request);
  if (request.command === 'setTabZoom') {
    const browserZoom = parseInt(request.browserZoom);
    console.log('setTabZoom: ' + browserZoom);
    chrome.tabs.query({ active: true, currentWindow: true, highlighted: true }, async tabs => {
      let currTabId = tabs[0].id;
      chrome.tabs.setZoom(currTabId, browserZoom / 100).then(
        async () => {
          const settings = await chrome.tabs.getZoom();
          console.log('Current zoom settings are:', settings);
          sendResponse('OK');
        },
        e => console.log(e),
      );
    });
  }
  return true;
});
