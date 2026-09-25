/* jhprogram Studio — interacción accesible y consentimiento de analítica. */
(() => {
    'use strict';

    const CONSENT_KEY = 'jhprogram_cookie_consent_v1';
    const GA_ID = 'G-GSQQEHWRJR';
    let analyticsLoaded = false;

    const getConsent = () => {
        try { return window.localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
    };

    const setConsent = (value) => {
        try { window.localStorage.setItem(CONSENT_KEY, value); } catch (_) { /* navegación privada o storage bloqueado */ }
    };

    const deleteAnalyticsCookies = () => {
        const hostname = window.location.hostname;
        const domains = ['', `;domain=${hostname}`, `;domain=.${hostname}`];
        ['_ga', `_ga_${GA_ID.replace(/[^A-Z0-9]/gi, '')}`].forEach((name) => {
            domains.forEach((domain) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
            });
        });
    };

    const loadAnalytics = () => {
        if (analyticsLoaded || getConsent() !== 'all') return;
        analyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.dataset.cookieCategory = 'analytics';
        document.head.appendChild(script);
    };

    const setAnalytics = (allowed) => {
        if (allowed) {
            setConsent('all');
            loadAnalytics();
            if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' });
        } else {
            setConsent('rejected');
            if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
            deleteAnalyticsCookies();
        }
    };

    const initCookies = () => {
        const banner = document.getElementById('cookie-banner');
        const modal = document.getElementById('cookie-modal');
        const analytics = document.getElementById('analytics-consent');
        if (!banner || !modal) return;

        const accept = document.getElementById('cookie-accept');
        const reject = document.getElementById('cookie-reject');
        const configure = document.getElementById('cookie-configure');
        const save = document.getElementById('cookie-save');
        const modalReject = document.getElementById('cookie-modal-reject');
        const close = document.getElementById('cookie-modal-close');
        const openSettings = document.getElementById('open-cookie-settings');

        const showBanner = () => { banner.hidden = false; };
        const hideBanner = () => { banner.hidden = true; };
        const showSettings = () => {
            hideBanner();
            if (analytics) analytics.checked = getConsent() === 'all';
            modal.hidden = false;
            if (close) close.focus();
        };
        const hideSettings = () => { modal.hidden = true; };

        accept?.addEventListener('click', () => { setAnalytics(true); hideBanner(); });
        reject?.addEventListener('click', () => { setAnalytics(false); hideBanner(); });
        configure?.addEventListener('click', showSettings);
        openSettings?.addEventListener('click', showSettings);
        save?.addEventListener('click', () => {
            setAnalytics(Boolean(analytics?.checked));
            hideSettings();
        });
        modalReject?.addEventListener('click', () => { setAnalytics(false); hideSettings(); });
        close?.addEventListener('click', () => {
            hideSettings();
            if (!getConsent()) showBanner();
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideSettings();
                if (!getConsent()) showBanner();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.hidden) {
                hideSettings();
                if (!getConsent()) showBanner();
            }
        });

        const consent = getConsent();
        if (consent === 'all') loadAnalytics();
        if (!consent) showBanner();
    };

    const initIntro = () => {
        const intro = document.getElementById('intro-overlay');
        const mainContent = document.getElementById('main-content');
        if (!intro) return;
        if (document.documentElement.classList.contains('skip-intro')) {
            intro.hidden = true;
            mainContent?.classList.add('visible');
            return;
        }
        document.body.style.overflow = 'hidden';
        const enter = () => {
            if (intro.hidden) return;
            intro.classList.add('fade-out');
            mainContent?.classList.add('visible');
            window.setTimeout(() => {
                intro.hidden = true;
                document.body.style.overflow = '';
                document.querySelector('.skip-link')?.focus({ preventScroll: true });
            }, 650);
        };
        intro.addEventListener('click', enter);
        intro.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                enter();
            }
        });
        document.querySelector('.skip-link')?.addEventListener('click', enter);
    };

    const initNavigation = () => {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navBackdrop = document.getElementById('navBackdrop');
        if (!navToggle || !navLinks) return;
        const firstLink = navLinks.querySelector('a');
        const openMenu = () => {
            navToggle.classList.add('open');
            navLinks.classList.add('open');
            navBackdrop?.classList.add('open');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Cerrar menú');
            document.body.style.overflow = 'hidden';
            firstLink?.focus();
        };
        const closeMenu = () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navBackdrop?.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
            if (!document.getElementById('intro-overlay') || document.getElementById('intro-overlay').hidden) document.body.style.overflow = '';
        };
        navToggle.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
        navBackdrop?.addEventListener('click', closeMenu);
        navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
                navToggle.focus();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        initIntro();
        initNavigation();
        initCookies();
    });
})();
