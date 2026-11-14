'use client';

import { useEffect } from 'react';

/**
 * Scroll-driven polish for the home page. It decorates server-rendered markup that React
 * never re-renders, so it works on the DOM directly.
 */
export function HomeEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const listen = (target: Window, type: string, fn: () => void) => {
      target.addEventListener(type, fn, { passive: true });
      cleanups.push(() => target.removeEventListener(type, fn));
    };

    // Fade out the bottom blur strip once the footer is in view, so the
    // footer itself never sits underneath it.
    const scrollFade = document.querySelector('.scroll-fade');
    const footer = document.querySelector('.site-footer');
    if (scrollFade && footer) {
      const updateScrollFade = () => {
        scrollFade.classList.toggle('is-hidden', footer.getBoundingClientRect().top <= window.innerHeight);
      };
      updateScrollFade();
      listen(window, 'scroll', updateScrollFade);
      listen(window, 'resize', updateScrollFade);
    }

    // Underline the nav link for the section being read. The active section is
    // the last one whose top has scrolled past a line just below the sticky nav.
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('#desktop-nav a[href^="#"], #mobile-menu a[href^="#"]');
    const navSections = [...new Set([...navLinks].map(a => a.getAttribute('href')!))]
      .map(href => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => el !== null);
    if (navSections.length) {
      const updateActiveNav = () => {
        const line = window.innerHeight * 0.3;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        let current: HTMLElement | null = null;
        if (atBottom) {
          current = navSections[navSections.length - 1];
        } else {
          navSections.forEach(section => {
            if (section.getBoundingClientRect().top <= line) current = section;
          });
        }
        const id = current ? `#${(current as HTMLElement).id}` : null;
        navLinks.forEach(a => {
          const active = a.getAttribute('href') === id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };
      updateActiveNav();
      listen(window, 'scroll', updateActiveNav);
      listen(window, 'resize', updateActiveNav);
    }

    return () => cleanups.forEach(fn => fn());
  }, []);

  return null;
}
