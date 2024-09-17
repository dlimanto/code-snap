chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startSelection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startSelection" }, (response) => {
        sendResponse({ status: "success", message: "Selection started" });
      });
    });
    return true;
  } else if (message.html && message.css) {
    chrome.storage.local.set({ selectedHTML: message.html, selectedCSS: message.css }, () => {
      console.log("Selected HTML & CSS saved.");
    });
  }
});
