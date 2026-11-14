'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const GAP = 10;
const EDGE = 8;

type Show = (link: HTMLAnchorElement, preview: string, mouseX?: number) => void;
type PreviewApi = { show: Show; move: (link: HTMLAnchorElement, mouseX: number) => void; hide: () => void };

const PreviewContext = createContext<PreviewApi | null>(null);

/**
 * Owns the one floating card shared by every <LinkPreview> inside it. The card drifts
 * toward the cursor along the link and flips below the link when there is no room above.
 * The open state lives on the card's class list so pointer moves never re-render React.
 */
export function LinkPreviewProvider({ previews, children }: { previews: string[]; children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const [src, setSrc] = useState<string>();
  const [mounted, setMounted] = useState(false);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHoverable(matchMedia('(hover: hover)').matches);
    return () => clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    if (!hoverable) return;
    const warm = () => previews.forEach(href => { new Image().src = href; });
    const idle = typeof requestIdleCallback === 'function';
    const id = idle ? requestIdleCallback(warm, { timeout: 3000 }) : window.setTimeout(warm, 2000);
    const onScroll = () => { if (activeRef.current) api.hide(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (idle) cancelIdleCallback(id);
      else clearTimeout(id);
      window.removeEventListener('scroll', onScroll);
    };
  }, [hoverable, previews]);

  const place = (link: HTMLAnchorElement, mouseX?: number) => {
    const card = cardRef.current;
    if (!card) return;
    const r = link.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const centre = r.left + r.width / 2;
    const drift = mouseX == null ? 0 : (mouseX - centre) / 2;
    const x = Math.min(Math.max(centre + drift - w / 2, EDGE), window.innerWidth - w - EDGE);
    const above = r.top - h - GAP;
    const y = above >= EDGE ? above : r.bottom + GAP;
    card.style.transformOrigin = above >= EDGE ? '50% 100%' : '50% 0%';
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const api: PreviewApi = {
    show(link, preview, mouseX) {
      if (!hoverable) return;
      clearTimeout(hideTimer.current);
      const card = cardRef.current;
      if (activeRef.current !== link && card) {
        activeRef.current = link;
        setSrc(preview);
        // Restart the pop-in when moving straight from one link to another
        card.classList.remove('is-open');
        card.style.transition = 'none';
        place(link, mouseX);
        void card.offsetWidth;
        card.style.transition = '';
      }
      card?.classList.add('is-open');
    },
    move(link, mouseX) {
      if (activeRef.current === link) place(link, mouseX);
    },
    hide() {
      hideTimer.current = window.setTimeout(() => {
        cardRef.current?.classList.remove('is-open');
        activeRef.current = null;
      }, 80);
    },
  };

  return (
    <PreviewContext.Provider value={api}>
      {children}
      {mounted && hoverable && createPortal(
        <div ref={cardRef} className="link-preview-card" aria-hidden="true">
          <img src={src} alt="" width={240} height={150} decoding="async" />
        </div>,
        document.body,
      )}
    </PreviewContext.Provider>
  );
}

export function LinkPreview({ href, preview, children }: { href: string; preview: string; children: React.ReactNode }) {
  const api = useContext(PreviewContext);
  return (
    <a
      className="link-preview"
      href={href}
      target="_blank"
      rel="noopener"
      data-preview={preview}
      onMouseEnter={e => api?.show(e.currentTarget, preview, e.clientX)}
      onMouseMove={e => api?.move(e.currentTarget, e.clientX)}
      onMouseLeave={() => api?.hide()}
      onFocus={e => api?.show(e.currentTarget, preview)}
      onBlur={() => api?.hide()}
    >
      {children}
    </a>
  );
}
