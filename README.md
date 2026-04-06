# Revive Dark Mode

Dark mode theme for the [Revive Adserver](https://www.revive-adserver.com/) admin interface.

Addresses [revive-adserver/revive-adserver#1634](https://github.com/revive-adserver/revive-adserver/issues/1634).

## Features

- Full dark theme covering all admin pages: navigation, tables, forms, alerts, panels, modals
- Toggle via moon/sun icon in the header bar
- Respects system preference (`prefers-color-scheme: dark`) by default
- Preference saved per-browser via `localStorage`
- Smooth transition animation when toggling
- Print always uses light mode
- UI icons auto-inverted; banner images and logos preserved
- Zero core file modifications - pure CSS override plugin
- CSS custom properties for easy palette customization

## Screenshots

*Install the plugin and click the moon icon to see the magic.*

## Requirements

- Revive Adserver 5.0.0 or higher
- PHP 8.1+
- A modern browser (CSS custom properties support)

## Installation

1. Download `rvDarkMode.zip` from the [Releases](../../releases) page (or run `./build.sh`)
2. Log in to Revive Adserver as admin
3. Go to **Plugins > Install**
4. Upload the ZIP file
5. Enable the plugin
6. Click the **moon icon** in the header to toggle dark mode

## How It Works

The plugin uses Revive's `registerUiListeners` hook to register a `beforePageHeader` listener. This listener:

1. Calls `registerStylesheetFile()` to inject `dark-mode.css` into `<head>` **after** all core CSS
2. Registers an `afterPageHeader` listener that injects the toggle button JavaScript

All CSS rules are scoped under `.rv-dark-mode` (applied to `<html>`), so they only activate when dark mode is toggled on. The CSS uses custom properties (`--rvd-*`) making it easy to customize the palette.

### What gets themed

- Body and page backgrounds
- Header bar and branding
- First/second/third level navigation
- Tables (headers, rows, hover, alternating colors, dropdowns)
- Forms (inputs, selects, textareas, buttons, disabled/error states)
- Alerts and messages (success, info, warning, error)
- Panels, sections, and context links
- Status indicators
- Modals
- Scrollbars (WebKit)
- Legacy `bgcolor` attributes

### Customizing the palette

Edit the CSS custom properties at the top of `dark-mode.css`:

```css
.rv-dark-mode {
    --rvd-bg-primary:    #1a1a2e;   /* Main background */
    --rvd-bg-secondary:  #16213e;   /* Content area */
    --rvd-text-primary:  #e0e0e0;   /* Main text */
    --rvd-accent:        #4da6e8;   /* Links and highlights */
    /* ... etc ... */
}
```

## Building

```bash
chmod +x build.sh
./build.sh
```

Produces `rvDarkMode.zip` ready for upload.

## Known Limitations

- Some legacy pages with heavy inline `style=` attributes (e.g., `bgcolor="#FFFFFF"`) may have spots that don't fully theme. The CSS handles the most common patterns with attribute selectors.
- Custom branding colors set via admin settings use inline `<style>` blocks with high specificity - the dark mode CSS uses `!important` on header elements to override these.
- The installer/upgrade wizard pages have their own CSS and may not be fully themed.

## License

GPLv2 or later, same as Revive Adserver.
