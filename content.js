// content.js
const adSelectors = [
  '.ad', '.advertisement', '[class*="ad-"]',
  '[id*="ad-"]', '.banner-ad', '.ad-wrapper'
];

const motivationalQuotes = [
  "You're capable of amazing things!",
  "Progress, not perfection!",
  "One small step today = big leap tomorrow! 💪",
  "Your potential is endless!",
  "Make today count! 🚀"
];

const replacementMessages = {
  quotes: motivationalQuotes,
  reminders: []
};

// Get stored reminders
chrome.runtime.sendMessage({ type: 'getReminders' }, (response) => {
  replacementMessages.reminders = [
    ...replacementMessages.reminders, // Defaults
    ...response // User-defined
  ];
});

function createWidget(type) {
  const widget = document.createElement('div');
  widget.className = 'adfriend-widget';
  
  const content = document.createElement('div');
  content.className = 'widget-content';
  
  const randomIndex = Math.floor(Math.random() * replacementMessages[type].length);
  content.textContent = replacementMessages[type][randomIndex];
  
  widget.appendChild(content);
  return widget;
}

function replaceAds() {
  for (const selector of adSelectors) {
    const adElements = document.querySelectorAll(selector);
    for (const adElement of adElements) {
      const replacementType = Math.random() > 0.5 ? 'quotes' : 'reminders';
      const widget = createWidget(replacementType);
      adElement.replaceWith(widget);
    }
  }
}

// Initial replacement
replaceAds();

// Watch for dynamic ad loading
const observer = new MutationObserver(replaceAds);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
