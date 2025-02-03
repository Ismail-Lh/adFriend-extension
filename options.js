// options.js
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['customReminders'], (result) => {
    document.getElementById('customReminders').value = 
      result.customReminders?.join('\n') || '';
  });

  document.getElementById('saveReminders').addEventListener('click', () => {
    const reminders = document.getElementById('customReminders').value
      .split('\n')
      .filter(line => line.trim());
    
    chrome.storage.sync.set({ customReminders: reminders }, () => {
      alert('Settings saved!');
    });
  });
});
