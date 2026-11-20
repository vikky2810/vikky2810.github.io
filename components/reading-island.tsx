'use client';

import { useEffect, useRef, useState } from 'react';

type Heading = { id: string; text: string };

const RING = 2 * Math.PI * 9;

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Floating "dynamic island" for blog posts: shows the section being read and a progress
 * ring, and opens into a table of contents built from the post's h2s.
 */
export function ReadingIsland({ title }: { title: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  // Post bodies are plain HTML without heading ids, so give each h2 a stable one here.
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.blog-content h2')];
    const used = new Set<string>();
    setHeadings(els.map(el => {
      if (!el.id) {
        let id = slugify(el.textContent ?? '') || 'section';
        for (let n = 2; used.has(id) || document.getElementById(id); n++) id = `${slugify(el.textContent ?? '')}-${n}`;
        el.id = id;
      }
      used.add(el.id);
      return { id: el.id, text: el.textContent?.trim() ?? '' };
    }));
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const els = headings.map(h => document.getElementById(h.id)!);
    const header = document.querySelector('.blog-header');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? Math.min(1, scrollY / max) : 0);
      setShown(header ? header.getBoundingClientRect().bottom < 80 : scrollY > 200);
      const line = innerHeight * 0.3;
      let idx = -1;
      els.forEach((el, i) => { if (el.getBoundingClientRect().top <= line) idx = i; });
      setActive(idx);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, [headings]);

  // The panel's height changes as the island widens (titles rewrap), so track it live.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const ro = new ResizeObserver(() => setPanelHeight(panel.scrollHeight));
    ro.observe(panel);
    return () => ro.disconnect();
  }, [headings]);

  // Close on Escape or a tap outside.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); pillRef.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  if (!headings.length) return null;

  const label = active < 0 ? 'Intro' : headings[active].text;
  const canHover = () => matchMedia('(hover: hover)').matches;
  const classes = ['reading-island', shown || open ? 'is-shown' : '', open ? 'is-open' : ''].join(' ');

  return (
    <nav
      ref={rootRef}
      className={classes}
      aria-label="Table of contents"
      style={open ? { height: `min(${panelHeight}px, 75vh)` } : undefined}
      onPointerEnter={() => canHover() && setOpen(true)}
      onPointerLeave={() => canHover() && setOpen(false)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <button
        ref={pillRef}
        type="button"
        className="reading-island-pill"
        aria-expanded={open}
        tabIndex={shown ? 0 : -1}
        onClick={() => setOpen(o => !o)}
      >
        <img src="/src/assets/profile-pic.webp" alt="" width={30} height={30} />
        <span className="reading-island-where">
          <span className="reading-island-kicker">Reading</span>
          <span key={label} className="reading-island-label">{label}</span>
        </span>
        <svg className="reading-island-ring" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="9" style={{ strokeDasharray: RING, strokeDashoffset: RING * (1 - progress) }} />
        </svg>
      </button>
      <div ref={panelRef} className="reading-island-panel" inert={!open}>
        <div className="reading-island-head">
          <span className="reading-island-title">{title}</span>
          <span className="reading-island-pct">{Math.round(progress * 100)}%</span>
        </div>
        <ol>
          {headings.map((h, i) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={i === active ? 'is-active' : i < active ? 'is-read' : undefined}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="reading-island-num">{String(i + 1).padStart(2, '0')}</span>
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
