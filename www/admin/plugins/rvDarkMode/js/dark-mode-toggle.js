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
        var btn = document.createElement('a');
        btn.id = 'rv-dark-mode-toggle';
        btn.href = '#';
        btn.title = 'Toggle dark mode';
        btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.style.cssText = 'font-size:18px;text-decoration:none;padding:0 4px;';

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

        // The header structure is:
        // <div id="oaNavigationExtraTop"> <ul> <li>...</li> ... </ul> </div>
        // We need to wrap our toggle in an <li> and insert into the <ul>

        var navTop = document.getElementById('oaNavigationExtraTop');
        if (navTop) {
            var ul = navTop.querySelector('ul');
            if (ul) {
                var li = document.createElement('li');
                li.style.cssText = 'display:inline;padding:0 3px;';
                li.appendChild(btn);
                // Insert as first item in the list
                if (ul.firstChild) {
                    ul.insertBefore(li, ul.firstChild);
                } else {
                    ul.appendChild(li);
                }
                return;
            }
        }

        // Fallback: try oaNavigationExtra (bottom bar)
        var navExtra = document.getElementById('oaNavigationExtra');
        if (navExtra) {
            var ul2 = navExtra.querySelector('ul') || navExtra;
            var li2 = document.createElement('li');
            li2.style.cssText = 'display:inline;padding:0 3px;';
            li2.appendChild(btn);
            if (ul2.firstChild) {
                ul2.insertBefore(li2, ul2.firstChild);
            } else {
                ul2.appendChild(li2);
            }
            return;
        }

        // Last resort: float in top-right corner
        var header = document.getElementById('oaHeader');
        if (header) {
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
