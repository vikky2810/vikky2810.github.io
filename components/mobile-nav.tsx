'use client';

import { useState } from 'react';
import { NAV_LINKS } from './nav-links';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  return (
    <nav id="hamburger-nav" aria-label="Primary (mobile)">
      <div></div>
      <div className="hamburger-menu">
        <button
          className={open ? 'hamburger-icon open' : 'hamburger-icon'}
          type="button"
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span></span> <span></span> <span></span>
        </button>
        <ul className={open ? 'menu-links open' : 'menu-links'} id="mobile-menu">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={toggle}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
