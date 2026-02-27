// ui/toggleButton.js

(() => {
  'use strict';

  // --- Create toggle button ---
  const btn = document.createElement('button');
  btn.id = 'custom-tooltip-toggle-btn';
  Object.assign(btn.style, {
    padding: '6.5px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    color: '#000',
    background: '#fff'
  });
  const style = document.createElement('style');
  style.textContent = `
    #custom-tooltip-toggle-btn:hover {
      border-color: #0071EB !important;
      color: #0071EB !important;
    }
  `;
  document.head.appendChild(style);

  // --- Function to refresh button label and opacity based on state ---
  function updateButton() {
    btn.textContent = `Tooltips:\xa0${customTooltipState.enabled ? 'ON' : 'OFF'}`;
    btn.style.opacity = customTooltipState.active && customTooltipState.visualToggle ? '1' : '0.5';
  }

  // --- Insert button into calendar header if it's visible ---
  function attachButton() {
    if (!customTooltipState.visualToggle) {
      btn.remove();
      return;
    }
    const header = document.querySelector('.calendar-header');
    if (header && !header.contains(btn)) {
      header.appendChild(btn); // Inject only once
      updateButton();
    }
  }

  // --- Toggle enabled state when button is clicked, save and show toast ---
  btn.addEventListener('click', () => {
    customTooltipState.enabled = !customTooltipState.enabled;
    chrome.storage.sync.set({ enabled: customTooltipState.enabled });
    tooltipToast.showToast(`Custom\xa0Tooltips\xa0${customTooltipState.enabled ? 'ON' : 'OFF'}`);
    updateButton();
  });

  // --- Use MutationObserver to catch SPA header loads/changes ---
  const headerObserver = new MutationObserver(() => attachButton());
  headerObserver.observe(document.body, { childList: true, subtree: true });

  // --- Listen for and react to state initialisation and updates. ---  
  window.addEventListener('tooltip-state-initialized', () => {
    attachButton();
    updateButton();
  });
  window.addEventListener('tooltip-state-updated', () => {
    attachButton();
    updateButton();
  });

  window.tooltipToggle = { updateButton, attachButton };
})();