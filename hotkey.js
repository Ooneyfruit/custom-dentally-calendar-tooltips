// hotkey.js

(() => {
  'use strict';

  // --- Dynamic keyboard shortcut to toggle tooltips based on stored hotkey ---
  window.addEventListener('keydown', e => {
    if (tooltipUtils.eventMatchesCombo(e, customTooltipState.hotkeyCombo)) {
      customTooltipState.enabled = !customTooltipState.enabled;
      chrome.storage.sync.set({ enabled: customTooltipState.enabled });
      if (!customTooltipState.enabled) tooltipModule.hideTooltip();
      tooltipToast.showToast(`Custom Tooltips ${customTooltipState.enabled ? 'ON' : 'OFF'}`);
      tooltipToggle.updateButton();
    }
  });
})();