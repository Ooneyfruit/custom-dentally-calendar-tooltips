// utils.js
// ----------------------
// Defines URL‑check and hotkey parsing/matching helpers.

(() => {
  'use strict';

  // --- Check if current URL matches /calendar/day/YYYY-MM-DD ---
  function isCalendarDayPage() {
    return /^\/calendar\/day\/\d{4}-\d{2}-\d{2}(\/)?$/.test(location.pathname);
  }


  // --- Hotkey handling: parse and match dynamic hotkey setting ---
  
  /**
   * Parse a stored normalized string like "Alt+L" or "Ctrl+Shift+K"
   * into an object { altKey: boolean, ctrlKey: boolean, shiftKey: boolean, metaKey: boolean, key: string }.
   */
  function parseComboString(comboStr) {
    const parts = comboStr.split('+').map(p => p.trim());
    const combo = { altKey: false, ctrlKey: false, shiftKey: false, metaKey: false, key: '' };
    for (const part of parts) {
      if (/^Alt$/i.test(part)) combo.altKey = true;
      else if (/^Ctrl$/i.test(part)) combo.ctrlKey = true;
      else if (/^Shift$/i.test(part)) combo.shiftKey = true;
      else if (/^Meta$/i.test(part)) combo.metaKey = true;
      else if (part) {
        // For the main key: use lowercase for comparison
        combo.key = part.length === 1 ? part.toLowerCase() : part.toLowerCase();
      }
    }
    return combo;
  }

  /**
   * Check if a KeyboardEvent matches the given combo object.
   */
  function eventMatchesCombo(e, combo) {
    if (!!e.altKey !== !!combo.altKey) return false;
    if (!!e.ctrlKey !== !!combo.ctrlKey) return false;
    if (!!e.shiftKey !== !!combo.shiftKey) return false;
    if (!!e.metaKey !== !!combo.metaKey) return false;
    const evKey = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
    return evKey === combo.key;
  }

  window.tooltipUtils = { isCalendarDayPage, parseComboString, eventMatchesCombo };
})();
