// state.js

(() => {
  'use strict';

  
  const state = {
    enabled: true, // Has the user enabled the feature?
    visualToggle: true,
    instantMode: true,
    hotkeyCombo: tooltipUtils.parseComboString('Alt+L'), // Default hotkey combo object
    active: tooltipUtils.isCalendarDayPage(), // Is the tooltip feature active on this page?
  };

  // --- On init: Load saved 'enabled' and 'hotkey' state from Chrome storage ---
  chrome.storage.sync.get({
    enabled: true,
    visualToggle: true,
    instantMode: true,
    hotkey: 'Alt+L'
  }, data => {
    state.enabled      = data.enabled;
    state.visualToggle = data.visualToggle;
    state.instantMode  = data.instantMode;
    try { state.hotkeyCombo = tooltipUtils.parseComboString(data.hotkey); }
    catch { /* Keep default */ }
    window.dispatchEvent(new Event('tooltip-state-initialized'));
  });

  // --- Listen for changes (from options page) ---
  chrome.storage.onChanged.addListener(changes => {
    if (changes.enabled)      state.enabled      = changes.enabled.newValue;
    if (changes.visualToggle) state.visualToggle = changes.visualToggle.newValue;
    if (changes.instantMode)  state.instantMode  = changes.instantMode.newValue;
    if (changes.hotkey) {
      try { state.hotkeyCombo = tooltipUtils.parseComboString(changes.hotkey.newValue); }
      catch { /* Ignore invalid newValue, keep previous */ }
    }
    window.dispatchEvent(new Event('tooltip-state-updated'));
  });

  window.customTooltipState = state;
})();