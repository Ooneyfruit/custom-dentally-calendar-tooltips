// navigation.js

(() => {
  'use strict';

  function handleLocationChange() {
    const now = tooltipUtils.isCalendarDayPage();
    if (now !== customTooltipState.active) {
      customTooltipState.active = now;
      if (!now) tooltipModule.hideTooltip();
      tooltipToggle.updateButton();
    }
    tooltipToggle.attachButton();
  }

  // wrap history API
  ['pushState','replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function(...args) {
      const ret = orig.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  });
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', handleLocationChange);
  window.addEventListener('load', handleLocationChange);

  // optional background redundancy
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'LOCATION_CHANGED') window.dispatchEvent(new Event('locationchange'));
  });
})();
