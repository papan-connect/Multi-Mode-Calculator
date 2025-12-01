// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');

// Check local storage for theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            iconSun.style.display = 'block';
            iconMoon.style.display = 'none';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block';
        }
    });
}

// Tab Switching
const tabs = document.querySelectorAll('.tab-btn');
const modes = document.querySelectorAll('.calculator-mode');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all
        tabs.forEach(t => t.classList.remove('active'));
        modes.forEach(m => m.classList.remove('active'));

        // Add active class to clicked
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const targetMode = document.getElementById(targetId);
        if (targetMode) {
            targetMode.classList.add('active');
        }
    });
});

// Initialize Modules
// Wait for DOM to be fully loaded since we are not using modules anymore
// and scripts might be loaded in head or body.
// Best to wrap in DOMContentLoaded just in case, or rely on defer.
document.addEventListener('DOMContentLoaded', () => {
    new BasicCalculator('basic');
    new AdvancedCalculator();
    new UnitConverter();
    new CurrencyConverter();
});
