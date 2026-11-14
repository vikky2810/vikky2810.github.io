'use client';

import { useEffect } from 'react';

/** Wires the Copy buttons that lib/code-blocks.ts renders next to each code block. */
export function CodeCopy() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('.code-block-wrapper > .copy-button');
      const code = button?.parentElement?.querySelector<HTMLElement>('pre code');
      if (!button || !code) return;
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 1500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
