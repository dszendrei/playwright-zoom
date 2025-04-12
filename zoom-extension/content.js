console.log('Content script is loaded');

window.addEventListener(
  'message',
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type && event.data.type === 'setTabZoom') {
      console.log('Content script received: ' + event.data.type + ' ' + event.data.browserZoom);
      setBrowserZoom(event.data.browserZoom);
    }
  },
  false,
);

function setBrowserZoom(browserZoom) {
  if (browserZoom && Number.isInteger(browserZoom)) {
    chrome.runtime.sendMessage(
      { command: 'setTabZoom', browserZoom: browserZoom },
      function (response) {
        if (tab.url.startsWith('chrome://')) return undefined;
        console.log('setTabZoom message was received by the service worker', response);
      },
    );
  }
}
