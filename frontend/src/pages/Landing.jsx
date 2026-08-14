import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <section className="landing-hero">
        <div>
          <span className="eyebrow">Municipal complaint system</span>
          <h1>
            Every pothole gets a <em>case number.</em>
          </h1>
          <p className="landing-sub">
            CivicLens turns "someone should fix this" into a tracked case — from the moment
            a citizen reports it to the moment it's closed out. No phone tag, no lost paperwork.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="btn btn-primary">
              Report an issue →
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
          </div>
          <div className="trust-row">
            <div>
              <strong>4 statuses</strong>
              Pending → In Progress → Resolved
            </div>
            <div>
              <strong>Full history</strong>
              every status change, logged
            </div>
            <div>
              <strong>Role-based</strong>
              citizen &amp; admin access
            </div>
          </div>
        </div>

        <div className="ticket" aria-hidden="true">
          <div className="ticket-head">
            <div>
              <span className="case-id mono">CASE #CL-08421</span>
              <strong>Streetlight outage</strong>
            </div>
            <span className="badge badge-progress">In Progress</span>
          </div>
          <div className="ticket-photo" />
          <div className="ticket-perf" />
          <div className="ticket-body">
            <h4>3rd &amp; Elm streetlight has been dark for a week</h4>
            <p>Reported by a resident near the intersection. Category: Electricity.</p>
            <div className="ticket-timeline">
              <div className="step done">
                <span className="dot" />
                Filed
              </div>
              <div className="step active">
                <span className="dot" />
                Assigned
              </div>
              <div className="step">
                <span className="dot" />
                Resolved
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-heading">
          <h2>Three steps, in this order</h2>
          <p className="muted">A complaint moves through the same pipeline every time — that's what makes it trackable.</p>
        </div>
        <div className="steps-row">
          <div className="step-card">
            <span className="step-num mono">01 — Report</span>
            <h3>File the issue</h3>
            <p>Title, description, category, location — plus a photo of the evidence if you have one.</p>
          </div>
          <div className="step-card">
            <span className="step-num mono">02 — Track</span>
            <h3>Watch it move</h3>
            <p>Search and filter your open cases from a dashboard built for exactly that.</p>
          </div>
          <div className="step-card">
            <span className="step-num mono">03 — Resolve</span>
            <h3>See it closed out</h3>
            <p>Admins update the status with a note — it's appended to the case's permanent history.</p>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-inner">
          <div className="section-heading">
            <h2>Built for both sides of the counter</h2>
            <p>Citizens file. Admins manage. Nobody chases a paper trail.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon-tag">🔒</div>
              <h3>JWT authentication</h3>
              <p>Citizen and admin roles, enforced on every route — not just hidden in the UI.</p>
            </div>
            <div className="feature-card">
              <div className="icon-tag">🔍</div>
              <h3>Search &amp; filter</h3>
              <p>Find a case by title, location, status, or category in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="icon-tag">📎</div>
              <h3>Photo evidence</h3>
              <p>Attach a photo when you file — it travels with the case to resolution.</p>
            </div>
            <div className="feature-card">
              <div className="icon-tag">🗂️</div>
              <h3>Full audit trail</h3>
              <p>Every status change is timestamped, attributed, and permanent.</p>
            </div>
            <div className="feature-card">
              <div className="icon-tag">📊</div>
              <h3>Live dashboards</h3>
              <p>Pending, in-progress, and resolved counts, updated as cases move.</p>
            </div>
            <div className="feature-card">
              <div className="icon-tag">⚡</div>
              <h3>Google sign-in</h3>
              <p>One tap to register or log in — no password to remember.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-band">
          <h2>Something needs fixing?</h2>
          <p>Open a case in under a minute. It's free, and it's the fastest way to get it in front of someone who can act on it.</p>
          <Link to="/register" className="btn btn-secondary">
            Create your account
          </Link>
        </div>
      </section>

      <footer className="site-footer">CivicLens Lite — a civic complaint management platform</footer>
    </>
  );
}
