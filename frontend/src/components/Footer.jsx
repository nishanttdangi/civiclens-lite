import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark" />
              Civic<span>Lens</span> <small>LITE</small>
            </Link>
            <p className="footer-tagline">
              Every civic complaint gets a case number, a status, and a paper trail —
              from report to resolution.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot" />
              All systems operational
            </div>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/register">Report an issue</Link></li>
              <li><Link to="/login">Track a case</Link></li>
              <li><Link to="/register">Admin access</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><span>Roads &amp; Potholes</span></li>
              <li><span>Water &amp; Sanitation</span></li>
              <li><span>Electricity</span></li>
              <li><span>Public Safety</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <ul>
              <li><a href="mailto:support@civiclens.example">support@civiclens.example</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href="#top">Back to top ↑</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="mono">© {YEAR} CivicLens Lite — built for citizens, run by cases.</span>
          <span className="mono footer-build">v1.0 · MERN stack</span>
        </div>
      </div>
    </footer>
  );
}