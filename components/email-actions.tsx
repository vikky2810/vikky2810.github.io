'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Result = 'copied' | 'failed';
type IconState = Result | 'idle';

const TOAST_MS = 2200;

const ICON = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

const STATE_ICON: Record<IconState, React.ReactNode> = {
  idle: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  copied: <polyline points="20 6 9 17 4 12" />,
  failed: <path d="M18 6 6 18M6 6l12 12" />,
};

const TOAST: Record<Result, { title: string; detail: (email: string) => string }> = {
  copied: { title: 'Email copied', detail: email => `${email} copied to clipboard.` },
  failed: { title: "Couldn't copy email", detail: () => 'Your browser blocked the clipboard. Select the address instead.' },
};

// navigator.clipboard only exists on HTTPS and localhost; a phone on the dev
// server's LAN address gets plain HTTP, so fall back to the legacy copy command
function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.append(field);
  field.select();
  field.setSelectionRange(0, text.length);
  const ok = document.execCommand('copy');
  field.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error('copy command refused'));
}

export function EmailActions({ email }: { email: string }) {
  const [result, setResult] = useState<Result>('copied');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
    return () => clearTimeout(timer.current);
  }, []);

  const copy = () => {
    writeClipboard(email).then(() => 'copied' as const, () => 'failed' as const).then(next => {
      setResult(next);
      setOpen(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(false), TOAST_MS);
    });
  };

  const icon: IconState = open ? result : 'idle';
  const toast = TOAST[result];

  return (
    <span className="email-group" role="group" aria-label="Email">
      <a className="email-btn email-btn-send" href={`mailto:${email}`} title="Write an email">
        <span className="email-btn-text">{email}</span>
      </a>
      <button className="email-btn email-btn-copy" type="button" data-status={icon} onClick={copy} aria-label="Copy email address" title="Copy email address">
        <svg key={icon} {...ICON} className={icon === 'idle' ? undefined : 'email-btn-state'}>{STATE_ICON[icon]}</svg>
      </button>
      <span className="visually-hidden" role="status">{open ? `${toast.title}. ${toast.detail(email)}` : ''}</span>
      {mounted && createPortal(
        <div className="toast" data-open={open} data-result={result} aria-hidden="true">
          <span className="toast-icon">
            <svg {...ICON} width={11} height={11} strokeWidth={3.5}>{STATE_ICON[result]}</svg>
          </span>
          <span className="toast-body">
            <span className="toast-title">{toast.title}</span>
            <span className="toast-detail">{toast.detail(email)}</span>
          </span>
        </div>,
        document.body,
      )}
    </span>
  );
}
