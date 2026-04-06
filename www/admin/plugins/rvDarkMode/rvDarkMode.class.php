<?php

/*
 * Revive Dark Mode - Admin Component
 *
 * Hooks into the Revive admin UI to inject:
 * 1. The dark mode CSS file (loaded after core CSS for proper overrides)
 * 2. A toggle button in the header bar
 * 3. JavaScript for toggle logic + localStorage persistence
 *
 * License: GPLv2 or later
 */

require_once LIB_PATH . '/Plugin/Component.php';

class Plugins_Admin_RvDarkMode_RvDarkMode extends OX_Component
{
    /**
     * Register UI event listeners.
     * Called by the plugin system when the component declares the
     * "registerUiListeners" hook in its XML manifest.
     */
    public function registerUiListeners()
    {
        OX_Admin_UI_Hooks::registerBeforePageHeaderListener(
            [$this, 'injectDarkMode']
        );
    }

    /**
     * Called before page header HTML is rendered.
     * Registers the dark mode CSS and adds JS for the toggle.
     */
    public function injectDarkMode($oContext)
    {
        // Register the dark mode CSS file.
        // It loads after core CSS in <head>, giving it override priority.
        // All rules are scoped under .rv-dark-mode so they only apply when active.
        $cssPath = MAX::constructURL(MAX_URL_ADMIN, 'plugins/rvDarkMode/css/dark-mode.css');
        registerStylesheetFile($cssPath);

        // Register an afterPageHeader listener to inject the toggle JS.
        // We can't inject JS in beforePageHeader since <body> isn't open yet,
        // but we CAN register a second listener that fires after the header.
        OX_Admin_UI_Hooks::registerAfterPageHeaderListener(
            [$this, 'injectToggleScript']
        );
    }

    /**
     * Called after the page header HTML has been rendered.
     * Injects the toggle button and persistence JavaScript.
     */
    public function injectToggleScript()
    {
        echo $this->getToggleScript();
    }

    /**
     * Generate the JavaScript for the dark mode toggle.
     */
    private function getToggleScript(): string
    {
        return <<<'SCRIPT'
<script type="text/javascript">
(function() {
    var STORAGE_KEY = 'rv_dark_mode';
    var html = document.documentElement;

    // Apply saved preference immediately (before paint)
    function applyPreference() {
        var pref = localStorage.getItem(STORAGE_KEY);
        // Default: respect system preference if no explicit choice
        if (pref === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                pref = '1';
            } else {
                pref = '0';
            }
        }
        if (pref === '1') {
            html.classList.add('rv-dark-mode');
        } else {
            html.classList.remove('rv-dark-mode');
        }
        return pref === '1';
    }

    var isDark = applyPreference();

    // Listen for system theme changes (when no explicit preference)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (localStorage.getItem(STORAGE_KEY) === null) {
                applyPreference();
                updateToggleIcon();
            }
        });
    }

    // Create toggle button
    function createToggle() {
        var btn = document.createElement('button');
        btn.id = 'rv-dark-mode-toggle';
        btn.title = 'Toggle dark mode';
        btn.innerHTML = isDark ? '&#9788;' : '&#9790;'; // sun : moon
        btn.setAttribute('aria-label', 'Toggle dark mode');

        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Add transition class for smooth switch
            html.classList.add('rv-dark-mode-transitioning');

            isDark = !isDark;
            localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');

            if (isDark) {
                html.classList.add('rv-dark-mode');
            } else {
                html.classList.remove('rv-dark-mode');
            }

            btn.innerHTML = isDark ? '&#9788;' : '&#9790;';

            // Remove transition class after animation
            setTimeout(function() {
                html.classList.remove('rv-dark-mode-transitioning');
            }, 350);
        });

        return btn;
    }

    function updateToggleIcon() {
        var btn = document.getElementById('rv-dark-mode-toggle');
        if (btn) {
            isDark = html.classList.contains('rv-dark-mode');
            btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
        }
    }

    // Insert toggle into the header navigation area
    function insertToggle() {
        var btn = createToggle();

        // Try to find the navigation extras area (top-right of header)
        var target = document.getElementById('oaNavigationExtraTop')
                  || document.getElementById('oaNavigationExtra')
                  || document.getElementById('oaHeader');

        if (target) {
            // Insert as first child so it appears on the left side of the extras
            if (target.firstChild) {
                target.insertBefore(btn, target.firstChild);
            } else {
                target.appendChild(btn);
            }
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertToggle);
    } else {
        insertToggle();
    }
})();
</script>
SCRIPT;
    }
}
