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

**Key Features:**
*   **Clearer Information:** Instantly view full appointment details without struggling with truncated default browser tooltips.
*   **Seamless Integration:** Operates smoothly over the `app.dentally.co` calendar day pages.
*   **Quick Toggle:** Easily enable or disable the custom tooltips using the customizable keyboard shortcut (default: `Alt+L`).
*   **Options Page:** Personalize extension behavior directly from the extension options.
*   **Instant/Visual Modes:** Configure the extension to run instantly on hover or show visual toggles.

Increase your efficiency and eliminate the hassle of unreadable calendar events with Custom Calendar Tooltips!

*Please note: This extension is designed specifically for Dentally users and requires an active session on app.dentally.co to function.*

---

## Privacy Policy

**Effective Date:** [Insert Date]

**Information Collection And Use**
The Custom Calendar Tooltips extension ("the Extension") operates entirely locally within your browser. 

*   **No Data Collection or Transmission:** The Extension does NOT collect, store, transmit, or share any personal information, browsing history, calendar data, or user credentials to external servers.
*   **Local Storage:** The Extension uses the Chrome Sync Storage API solely to save your local user preferences (such as enabling/disabling the extension and configuring visual/instant modes). This data is synced according to your Google Account preferences, if enabled.
*   **Host Access:** The Extension requests explicit permission to access `https://app.dentally.co/*` to inject its custom tooltip functionality onto the calendar pages. It does not access or modify any other websites.

**Changes To This Privacy Policy**
We may update our Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

**Contact Us**
If you have any questions about this Privacy Policy, please contact the developer via the support link on the Chrome Web Store.

---

## Permission Justifications (For Review Process)
*You may be asked to justify the permissions the extension requires. Feel free to copy and paste these justifications when uploading your manifest via the Developer Dashboard.*

*   `storage`: Required to save user preferences, such as whether the extension is currently enabled or disabled, and the specific display mode preferences (e.g., `visualToggle`, `instantMode`).
*   `webNavigation`: Required to detect Single Page Application (SPA) navigations within the Dentally app using the History API. This allows the extension to dynamically update its state without requiring a full page reload when the user navigates between different calendar views.
*   `host_permissions` (`https://app.dentally.co/*`): Required to inject the content scripts (`state.js`, `utils.js`, `tooltip.js`, etc.) that implement the custom tooltip logic specifically on the Dentally web application. The extension is designed strictly to enhance the user interface of this specific domain.
