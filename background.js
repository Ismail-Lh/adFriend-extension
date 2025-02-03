// Example: Context menu creation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'adfriend-context',
    title: 'Replace as AdFriend Widget',
    contexts: ['page', 'selection']
  });
});

// Example: Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'adfriend-context') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: manualReplacement
    });
  }
});

// Example message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getReminders') {
    chrome.storage.sync.get(['customReminders'], (result) => {
      sendResponse(result.customReminders || []);
    });
    return true; // Keep message channel open for async response
  }
});

// Optional: Content script coordination
function manualReplacement() {
  // This function would be called from the context menu
  if (typeof replaceAds === 'function') {
    replaceAds();
  }
}
