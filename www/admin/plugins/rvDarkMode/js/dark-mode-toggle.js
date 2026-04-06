/*
 * Revive Dark Mode - Toggle Script
 *
 * Adds a moon/sun toggle to the admin header bar.
 * Persists preference in localStorage.
 * Respects system prefers-color-scheme when no explicit choice.
 *
 * License: GPLv2 or later
 */
(function() {
    var STORAGE_KEY = 'rv_dark_mode';
    var html = document.documentElement;

    function applyPreference() {
        var pref = localStorage.getItem(STORAGE_KEY);
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

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
            if (localStorage.getItem(STORAGE_KEY) === null) {
                isDark = applyPreference();
                updateToggleIcon();
            }
        });
    }

    function createToggle() {
        var btn = document.createElement('button');
        btn.id = 'rv-dark-mode-toggle';
        btn.title = 'Toggle dark mode';
        btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
        btn.setAttribute('aria-label', 'Toggle dark mode');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            html.classList.add('rv-dark-mode-transitioning');

            isDark = !isDark;
            localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');

            if (isDark) {
                html.classList.add('rv-dark-mode');
            } else {
                html.classList.remove('rv-dark-mode');
            }

            btn.innerHTML = isDark ? '&#9788;' : '&#9790;';

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

    function insertToggle() {
        var btn = createToggle();

        // Try multiple possible insertion points in the header
        var target = document.getElementById('oaNavigationExtraTop')
                  || document.getElementById('oaNavigationExtra');

        if (target) {
            // Prepend before existing content
            if (target.firstChild) {
                target.insertBefore(btn, target.firstChild);
            } else {
                target.appendChild(btn);
            }
            return;
        }

        // Fallback: insert into the header bar itself
        var header = document.getElementById('oaHeader');
        if (header) {
            // Create a container positioned to the right
            var container = document.createElement('div');
            container.style.cssText = 'position:absolute;top:8px;right:10px;z-index:9999;';
            container.appendChild(btn);
            header.style.position = 'relative';
            header.appendChild(container);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertToggle);
    } else {
        insertToggle();
    }
})();
