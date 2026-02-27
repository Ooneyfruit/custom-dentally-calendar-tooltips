// ui/tooltip.js

(() => {
  'use strict';

  // --- Create and style the custom tooltip container. ---
  const tip = document.createElement('div');
  Object.assign(tip.style, {
    position: 'absolute',
    pointerEvents: 'none',
    background: '#333',
    color: '#fff',
    padding: '6px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 9999,
    display: 'none',
    opacity: '0',
    transition: 'opacity 0.2s ease-in-out',
    whiteSpace: 'pre-wrap',
    maxWidth: '300px'
  });
  document.body.appendChild(tip);

  // --- State tracking ---
  const suppressedTitles = new WeakMap();
  let currentEl = null;         // Currently hovered element
  let showTimer = null;         // Timer for classic delayed mode
  let lastMouse = { x: 0, y: 0 }; // Last known mouse position
  const HIDE_RADIUS = 10;       // Max distance to allow cursor to move before hiding tooltip

  // --- Track mouse position globally ---
  document.body.addEventListener('mousemove', e => {
    lastMouse.x = e.pageX;
    lastMouse.y = e.pageY;
  });

  /**
   * Remove native title attributes within the hovered element subtree
   * and store them in a WeakMap for later restoration.
   */
  function suppressNativeTitles(el) {
    if (!el || suppressedTitles.has(el)) return;
    const map = new Map();
    el.querySelectorAll('[title]').forEach(node => {
      map.set(node, node.getAttribute('title'));
      node.removeAttribute('title');
    });
    suppressedTitles.set(el, map);
  }

  // --- Restore native title attributes previously removed from an element's subtree. ---
  function restoreNativeTitles(el) {
    const map = suppressedTitles.get(el);
    if (!map) return;
    for (const [node, title] of map.entries()) node.setAttribute('title', title);
    suppressedTitles.delete(el);
  }

  // --- Clear any pending show tooltip timer ---
  function clearShowTimer() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
  }

  // --- Position the tooltip near the cursor ---
  function positionTip(x, y) {
    tip.style.left = x + 15 + 'px';
    tip.style.top = y + 15 + 'px';
  }

  /**
   * Show tooltip instantly at mouse event location with no animation.
   */
  function showInstant(el, evt) {
    clearShowTimer();
    suppressNativeTitles(el);
    const text = el.getAttribute('data-original-title') || el.dataset._origTitle || '';
    if (!text) return;
    tip.textContent = text;
    positionTip(evt.pageX, evt.pageY);
    tip.style.transition = 'none';
    tip.style.opacity = '1';
    tip.style.display = 'block';
    void tip.offsetWidth; // force reflow
    tip.style.transition = 'opacity 0.2s ease-in-out';
    currentEl = el;
  }

  // --- Show tooltip after delay with fade-in effect at last known mouse location. ---
  function showClassic(el) {
    clearShowTimer();
    showTimer = setTimeout(() => {
      suppressNativeTitles(el);
      const text = el.getAttribute('data-original-title') || el.dataset._origTitle || '';
      if (!text) return;
      tip.textContent = text;
      positionTip(lastMouse.x, lastMouse.y);
      tip.style.display = 'block';
      tip.style.opacity = '0';
      void tip.offsetWidth; // force reflow
      tip.style.transition = 'opacity 0.2s ease-in-out';
      tip.style.opacity = '1';
      currentEl = el;
    }, 500);
  }

  // Hide tooltip with fade-out effect and restore native titles. ---
  function hideTooltip() {
    clearShowTimer();
    if (tip.style.display === 'block') {
      tip.style.opacity = '0';
      const onTransitionEnd = () => {
        tip.style.display = 'none';
        tip.removeEventListener('transitionend', onTransitionEnd);
      };
      tip.addEventListener('transitionend', onTransitionEnd);
    }
    if (currentEl) {
      restoreNativeTitles(currentEl);
      currentEl = null;
    }
  }

  // --- Handle tooltip activation on hover ---
  document.body.addEventListener('mouseover', e => {
    if (!(customTooltipState.active && customTooltipState.enabled)) return;

    // Eagerly intercept ANY title attribute hovered immediately to suppress native tooltips
    const elWithTitle = e.target.closest('[title]');
    if (elWithTitle) {
      const native = elWithTitle.getAttribute('title');
      if (native) {
        elWithTitle.dataset._origTitle = native;
        elWithTitle.removeAttribute('title');
      }
    }

    const el = e.target.closest('[data-test-data="calendar-day-appointment"], [data-_orig-title], [data-original-title]');
    // Also check if the element we just stripped happens to be our target (or if it just had a title)
    const targetEl = el || elWithTitle;

    if (!targetEl) return;

    // Ensure we capture the title if it wasn't stripped by the eager check (e.g., dynamically added)
    const native = targetEl.getAttribute('title');
    if (native) {
      targetEl.dataset._origTitle = native;
      targetEl.removeAttribute('title');
    }

    if (customTooltipState.instantMode) {
      showInstant(targetEl, e);
    } else {
      showClassic(targetEl);
    }
  }, true); // Use capture phase to intercept as early as possible

  // --- Update tooltip position or cancel/close tooltip during mouse movement ---
  document.body.addEventListener('mousemove', e => {
    if (!(customTooltipState.active && customTooltipState.enabled)) return;
    if (customTooltipState.instantMode) {
      if (tip.style.display === 'block') positionTip(e.pageX, e.pageY);
    } else {
      if (!currentEl) {
        const dx = e.pageX - lastMouse.x;
        const dy = e.pageY - lastMouse.y;
        if (Math.hypot(dx, dy) > HIDE_RADIUS) clearShowTimer();
      } else {
        const dx = e.pageX - lastMouse.x;
        const dy = e.pageY - lastMouse.y;
        if (Math.hypot(dx, dy) > HIDE_RADIUS) hideTooltip();
      }
    }
  });

  // --- Hide tooltip on mouseout of the target element ---
  document.body.addEventListener('mouseout', e => {
    const el = e.target.closest('[data-test-data="calendar-day-appointment"], [title], [data-_orig-title], [data-original-title]');
    if (el === currentEl) hideTooltip();
  });

  // --- Hide tooltip on mousedown or keypress ---
  document.body.addEventListener('mousedown', hideTooltip);
  window.addEventListener('keydown', hideTooltip);

  // --- Hide tooltip if state changes disable tooltips ---
  window.addEventListener('tooltip-state-updated', () => {
    if (!customTooltipState.enabled) hideTooltip();
  });

  // --- Hide tooltip on scroll in classic mode, but reset so small movement can retrigger ---
  window.addEventListener('scroll', () => {
    if (!customTooltipState.instantMode) {
      hideTooltip();

      // If tooltips are active/enabled, check if still over an element that should show a tooltip
      if (customTooltipState.active && customTooltipState.enabled) {
        // Compute client coordinates from lastMouse.pageX/Y
        const clientX = lastMouse.x - window.pageXOffset;
        const clientY = lastMouse.y - window.pageYOffset;
        // Find the element under the pointer
        const el = document.elementFromPoint(clientX, clientY)?.closest('[data-test-data="calendar-day-appointment"], [title], [data-_orig-title], [data-original-title]');
        if (el) {
          // Mirror what happens on mouseover: suppress native title attribute
          const native = el.getAttribute('title');
          if (native) {
            el.dataset._origTitle = native;
            el.removeAttribute('title');
          }
          // Schedule showClassic so that a small movement (within HIDE_RADIUS) will not cancel it
          showClassic(el);
        }
      }
    }
  }, true);


  // --- Export hideTooltip to allow manual external clearing ---
  window.tooltipModule = { hideTooltip };
})();