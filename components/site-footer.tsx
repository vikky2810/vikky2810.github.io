import { FooterYear } from './footer-year';
import '@/styles/site-footer.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a href="/" className="footer-name">Vikram Kamble</a>
        <ul className="footer-links">
          <li>
            {'© '}
            <FooterYear buildYear={new Date().getFullYear()} />
          </li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/feed.xml">RSS</a></li>
        </ul>
      </div>
    </footer>
  );
}
