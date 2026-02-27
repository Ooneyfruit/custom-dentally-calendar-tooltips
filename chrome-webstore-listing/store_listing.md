# Custom Calendar Tooltips - Chrome Web Store Listing

## Store Listing Details

### Language
English (UK) is recommended, but you may choose your primary locale.

### Name (Short name in manifest)
Custom Calendar Tooltips

### Short Description (Matches manifest)
Replaces truncated tooltips with custom tooltips on Dentally calendar pages. Toggle with Alt+L by default.

### Category
Productivity

### Detailed Description
The Custom Calendar Tooltips extension enhances the user experience when viewing the Dentally calendar by replacing standard, often truncated tooltips with a more accessible and easily readable custom tooltip interface.

Key Features:
*   Clearer Information: Instantly view full appointment details without struggling with truncated default browser tooltips.
*   Seamless Integration: Operates smoothly over the `app.dentally.co` calendar day pages.
*   Quick Toggle: Easily enable or disable the custom tooltips using the customisable keyboard shortcut (default: `Alt+L`).
*   Options Page: Personalise extension behaviour directly from the extension options.
*   Instant/Visual Modes: Configure the extension to run instantly on hover or show visual toggles.

Increase your efficiency and eliminate the hassle of unreadable calendar events with Custom Calendar Tooltips!

*Please note: This extension is designed specifically for Dentally users and requires an active session on app.dentally.co to function.*

---

## Chrome Web Store Privacy Form Answers
*Use this section to directly fill out the "Privacy" tab in the Chrome Developer Dashboard.*

### Single Purpose Description
The single purpose of the Custom Calendar Tooltips extension is to improve readability and user experience by replacing standard, truncated browser tooltips with larger, custom-styled tooltips specifically for appointment items on the Dentally calendar pages (app.dentally.co). The curtailed tooltips occur only in ChromeOS and not in other operating systems. 

### Permission Justifications
*   **`webNavigation`**: Required to detect History API changes (Single Page Application navigations) within the Dentally web application. This allows the extension to dynamically update its state without requiring a full page reload when the user navigates between calendar views.
*   **`storage`**: Required locally save user preferences across sessions, such as whether the custom tooltips are enabled, and specific display mode preferences (e.g., visual toggle or instant hover mode).

### Host Permission Justification
**`https://app.dentally.co/*`**: This host permission is strictly required to inject the extension's content scripts into the Dentally web application. The extension's core functionality—replacing default browser tooltips with enhanced custom tooltips on calendar day pages—relies on observing DOM changes and reading appointment data directly from the `app.dentally.co` domain. The extension does not request access to, nor does it read or modify, content on any other websites.
