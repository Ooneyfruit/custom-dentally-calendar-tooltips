// options.js
// ----------------------
// Handles loading, displaying, and saving the 'enabled'
// toggle and 'hotkey' in the options page

document.addEventListener('DOMContentLoaded', () => {
  const toggle       = document.getElementById('toggle');
  const visualToggle = document.getElementById('visual-toggle');
  const instantMode  = document.getElementById('instant-mode-toggle');
  const status       = document.getElementById('status');
  const saveBtn      = document.getElementById('save');

  const hotkeyInput  = document.getElementById('hotkey');
  const hotkeyStatus = document.getElementById('hotkey-status');

  // --- Store the initially loaded settings to compare for unsaved changes. ---
  let initialEnabled;
  let initialVisualToggle;
  let initialInstantMode;
  let initialHotkey;

  // --- Blocklist of normalized combos that are known to conflict. ---
  const blocklist = new Set([
    // Common Chrome/browser shortcuts on Windows/Linux
    'Ctrl+T', 'Ctrl+N', 'Ctrl+W', 'Ctrl+R', 'Ctrl+Shift+N', 'Ctrl+Shift+T', 'Ctrl+Shift+W',
    'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Ctrl+P', 'Ctrl+S', 'Ctrl+O', 'Ctrl+F', 'Ctrl+H',
    'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
    // macOS common: use Meta instead of Ctrl
    'Meta+T','Meta+N','Meta+W','Meta+R','Meta+Shift+N','Meta+Shift+T','Meta+Shift+W',
    'Meta+Tab','Meta+Shift+Tab','Meta+P','Meta+S','Meta+O','Meta+F','Meta+H', 'Meta+L', 'Meta+M'
    // Note: This list is not exhaustive; users may still pick conflicting combos.
  ]);

  // --- Normalize a key event or a stored string into a canonical form, e.g. "Alt+Shift+L" ---
  function normalizeCombo({ altKey, ctrlKey, metaKey, shiftKey, key }) {
    // We ignore pure modifier presses; key should be a non-modifier.
    // Normalize key: uppercase single character or standardized name for others.
    let parts = [];
    if (ctrlKey) parts.push('Ctrl');
    if (metaKey) parts.push('Meta');
    if (altKey) parts.push('Alt');
    if (shiftKey) parts.push('Shift');
    const k = key.length === 1 ? key.toUpperCase() : key[0].toUpperCase() + key.slice(1);
    // Exclude if the key is itself a modifier key name
    if (!['Control','Shift','Alt','Meta'].includes(key)) {
      parts.push(k);
    }
    return parts.join('+');
  }

  // --- Validate a normalized combo string: return { ok: boolean, message: string } ---
  function validateCombo(combo) {
    if (!combo) {
      return { ok: false, message: 'No key combination detected.' };
    }
    // If only a modifier (no actual key), reject
    const hasPlus = combo.includes('+');
    if (!hasPlus) {
      return { ok: false, message: 'Please include at least one modifier (Ctrl, Alt, or Meta) plus a key.' };
    }
    if (blocklist.has(combo)) {
      return { ok: false, message: `“${combo}” is a common browser/OS shortcut. Please choose another.` };
    }
    // Otherwise tentatively ok
    return { ok: true, message: `OK: ${combo}` };
  }

  // --- Load saved settings ---
  chrome.storage.sync.get({ 
    enabled: true,
    visualToggle: true,
    instantMode: true,
    hotkey: 'Alt+L' 
  }, data => {
    initialEnabled      = data.enabled;
    initialVisualToggle = data.visualToggle;
    initialInstantMode  = data.instantMode;
    initialHotkey       = data.hotkey;

    // Reflect in UI
    toggle.checked       = initialEnabled;
    visualToggle.checked = initialVisualToggle;
    instantMode.checked  = initialInstantMode;
    hotkeyInput.value    = initialHotkey;
    // Validate the loaded hotkey
    const v = validateCombo(initialHotkey);
    if (v.ok) {
      hotkeyStatus.textContent = '';
      hotkeyStatus.classList.remove('error','ok');
    } else {
      hotkeyStatus.textContent = v.message;
      hotkeyStatus.classList.add('error');
      hotkeyStatus.classList.remove('ok');
    }
    updateStatus();
  });

  // --- When toggle changes, update status. ---
  toggle.addEventListener('change', () => {
    updateStatus();
  });
  
  visualToggle.addEventListener('change', updateStatus);
  instantMode.addEventListener('change', updateStatus);

  // --- When hotkey input is focused, listen for keydown to capture combo. ---
  hotkeyInput.addEventListener('focus', () => {
    hotkeyStatus.textContent = 'Press desired key combination...';
    hotkeyStatus.classList.remove('ok','error');
  });
  
  hotkeyInput.addEventListener('keydown', e => {
    e.preventDefault();
    e.stopPropagation();
    const combo = normalizeCombo(e);
    const v = validateCombo(combo);
    if (v.ok) {
      hotkeyInput.value = combo;
      hotkeyStatus.textContent = '';
      hotkeyStatus.classList.remove('error');
      hotkeyStatus.classList.add('ok');
    } else {
      // Keep the previous value in the input, but show error
      hotkeyStatus.textContent = v.message;
      hotkeyStatus.classList.add('error');
      hotkeyStatus.classList.remove('ok');
    }
    updateStatus();
  });
  
  // --- If input loses focus without keydown, clear prompt if matching saved. ---
  hotkeyInput.addEventListener('blur', () => {
    // If user hasn't changed to a valid new combo, restore initial or last valid
    const current = hotkeyInput.value;
    if (!current) {
      hotkeyInput.value = initialHotkey || '';
    }
    const v = validateCombo(hotkeyInput.value);
    if (!v.ok) {
      // keep showing error until valid or saved
    } else {
      hotkeyStatus.textContent = '';
      hotkeyStatus.classList.remove('error','ok');
    }
    updateStatus();
  });

  // --- Handle Save click: store both settings if valid. ---
  saveBtn.addEventListener('click', () => {
    const enabledVal       = toggle.checked;
    const visualToggleVal  = visualToggle.checked;
    const instantVal       = instantMode.checked;
    const hotkeyVal        = hotkeyInput.value || '';
    const v = validateCombo(hotkeyVal);
    if (!v.ok) {
      // refuse to save invalid hotkey
      hotkeyStatus.textContent = v.message;
      hotkeyStatus.classList.add('error');
      hotkeyStatus.classList.remove('ok');
      return;
    }
    chrome.storage.sync.set({ 
      enabled: enabledVal,
      visualToggle: visualToggleVal,
      instantMode: instantVal,
      hotkey: hotkeyVal
    }, () => {
      initialEnabled = enabledVal;
      initialVisualToggle = visualToggleVal;
      initialInstantMode = instantVal;
      initialHotkey = hotkeyVal;
      
      updateStatus();
    });
  });

  function updateStatus() {
    const enabledChanged = (toggle.checked       !== initialEnabled);
    const visualChanged  = (visualToggle.checked !== initialVisualToggle);
    const instantChanged = (instantMode.checked  !== initialInstantMode);
    const hotkeyChanged  = (hotkeyInput.value    !== initialHotkey);
    if (instantChanged || enabledChanged || visualChanged || hotkeyChanged) {
      status.textContent = 'Unsaved changes.';
      status.classList.add('unsaved');
      status.classList.remove('saved');
    } else {
      status.textContent = '';
      status.classList.remove('unsaved','saved');
    }
  }
});
