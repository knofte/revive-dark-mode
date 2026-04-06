<?php

/*
 * Revive Dark Mode - Admin Component
 *
 * Hooks into the Revive admin UI to inject:
 * 1. The dark mode CSS file (loaded after core CSS for proper overrides)
 * 2. The toggle JS file (loaded in <head> via otherJSFiles)
 *
 * License: GPLv2 or later
 */

require_once LIB_PATH . '/Plugin/Component.php';

class Plugins_Admin_RvDarkMode_RvDarkMode extends OX_Component
{
    /**
     * Register UI event listeners.
     */
    public function registerUiListeners()
    {
        OX_Admin_UI_Hooks::registerBeforePageHeaderListener(
            [$this, 'injectDarkMode']
        );
    }

    /**
     * Called before page header HTML is rendered.
     * Registers both CSS and JS files.
     */
    public function injectDarkMode($oContext)
    {
        $pluginBase = MAX::constructURL(MAX_URL_ADMIN, 'plugins/rvDarkMode/');

        // CSS: loads after core CSS in <head>, scoped under .rv-dark-mode
        registerStylesheetFile($pluginBase . 'css/dark-mode.css');

        // JS: register via the same global UI instance and also directly
        // into the global array to ensure it gets picked up by the template
        $jsFile = $pluginBase . 'js/dark-mode-toggle.js';
        $GLOBALS['_MAX']['ADMIN_UI'] = OA_Admin_UI::getInstance();
        $GLOBALS['_MAX']['ADMIN_UI']->otherJSFiles[] = $jsFile;
    }
}
