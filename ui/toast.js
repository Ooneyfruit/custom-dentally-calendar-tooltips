// ui/toast.js
// ----------------------
// Creates a floating toast container on page load
// and exports a showToast(msg) function.

(() => {
  'use strict';
  
  // --- Create and style the toast notification container ---
  const toast = document.createElement('div');

  Object.assign(toast.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 10000,
    opacity: '0',
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  });
  document.body.appendChild(toast);

  // --- Show a temporary toast notification ---
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => (toast.style.opacity = '0'), 1000);
  }
  
  window.tooltipToast = { showToast };
})();