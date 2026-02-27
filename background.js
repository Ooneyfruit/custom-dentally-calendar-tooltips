// background.js

'use strict';

/**
 * Listen for SPA navigation events (History API changes)
 * and notify the content script so it can update its active state.
 */
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  // Send a message to the content script in the affected tab
  chrome.tabs.sendMessage(details.tabId, {
    type: 'LOCATION_CHANGED', // Custom message type
    url: details.url          // New URL after navigation
  });
});

/**
 * On extension install, initialize default settings.
 * Sets:
 *   - enabled: true on ChromeOS, false otherwise
 *   - visualToggle: false
 *   - instantMode: false
 */
chrome.runtime.onInstalled.addListener(({ reason }) => {
  // Only set defaults on fresh install, not on updates
  if (reason === 'install') {
    chrome.runtime.getPlatformInfo(platform => {
      const isChromeOS = platform.os === 'cros';
      chrome.storage.sync.set({
        enabled: isChromeOS,
        visualToggle: false,
        instantMode: false
      }, () => {
        console.log(
          `Default settings applied: enabled = ${isChromeOS}, ` +
          `visualToggle = true, instantMode = false (OS detected: ${platform.os})`
        );
      });
    });
  }
});

