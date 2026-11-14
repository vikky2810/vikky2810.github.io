'use client';

import { useEffect, useState } from 'react';

/** Renders the build year, then the visitor's current year once on the client. */
export function FooterYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span id="footer-year">{year}</span>;
}
