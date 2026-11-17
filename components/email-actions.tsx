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
  copied: { title: 'Email copied', detail: email => email },
  failed: { title: "Couldn't copy", detail: () => 'Select the address instead' },
};

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
    navigator.clipboard.writeText(email).then(() => 'copied' as const, () => 'failed' as const).then(next => {
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
            <svg {...ICON} width={13} height={13} strokeWidth={2.5}>{STATE_ICON[result]}</svg>
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
