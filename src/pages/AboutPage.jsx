import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  QrCode,
  Globe,
  Lock,
  Server,
  Code2,
  GitBranch,
  ArrowRight,
  Database,
  Clock,
  Users
} from "lucide-react";

const TECH_STACK = [
  {
    category: "Backend",
    color: "success",
    items: [
      { name: "Node.js v24", desc: "JavaScript runtime" },
      { name: "Express.js", desc: "HTTP server framework" },
      { name: "MongoDB", desc: "Document database (Mongoose ODM)" },
      { name: "NodeCache", desc: "In-process TTL cache layer" },
      { name: "JSON Web Tokens", desc: "Stateless authentication" },
      { name: "bcryptjs", desc: "Secure password hashing" },
      { name: "Nanoid", desc: "Short code generation" },
      { name: "qrcode", desc: "Server-side QR generation" }
    ]
  },
  {
    category: "Frontend",
    color: "primary",
    items: [
      { name: "React 19", desc: "UI component library" },
      { name: "Vite 6", desc: "Build tool and dev server" },
      { name: "Bootstrap 5", desc: "CSS framework" },
      { name: "Lucide React", desc: "Icon set" },
      { name: "Axios", desc: "HTTP client with interceptors" },
      { name: "React Router v7", desc: "Client-side routing" }
    ]
  }
];

const FEATURES = [
  {
    icon: <Zap size={20} className="text-warning" />,
    title: "Link Caching",
    desc: "Frequently visited links are served directly from memory, skipping the database and reducing redirect latency."
  },
  {
    icon: <ShieldCheck size={20} className="text-success" />,
    title: "Request Rate Limits",
    desc: "Three-tier rate limiting — global, link creation, and redirect — prevents automated abuse and ensures fair use."
  },
  {
    icon: <BarChart3 size={20} className="text-primary" />,
    title: "Click Analytics",
    desc: "Every redirect records device type, browser, operating system, and referrer in the background, without slowing down the redirect."
  },
  {
    icon: <QrCode size={20} className="text-info" />,
    title: "QR Code Generation",
    desc: "Every short link includes an on-demand QR code, generated server-side and returned as a downloadable image."
  },
  {
    icon: <Lock size={20} className="text-danger" />,
    title: "User Accounts",
    desc: "Register an account to manage your links privately. Protected routes ensure only authenticated users access the dashboard."
  },
  {
    icon: <Clock size={20} className="text-secondary" />,
    title: "Link Expiration",
    desc: "Set an optional expiration date on any link. Expired links return a friendly error page instead of redirecting."
  },
  {
    icon: <Globe size={20} className="text-warning" />,
    title: "Custom Aliases",
    desc: "Replace the random short code with a human-readable alias of your choice — great for branding and sharing."
  },
  {
    icon: <Users size={20} className="text-success" />,
    title: "Guest Shortening",
    desc: "No account required to shorten a link. Registered users get a private dashboard; guests get instant results."
  }
];

const API_ROWS = [
  { method: "POST", color: "success", path: "/api/v1/auth/register", desc: "Create a new user account", auth: "—" },
  { method: "POST", color: "success", path: "/api/v1/auth/login", desc: "Authenticate and receive a token", auth: "—" },
  { method: "POST", color: "success", path: "/api/v1/auth/logout", desc: "Invalidate the current session", auth: "JWT" },
  { method: "GET",  color: "primary", path: "/api/v1/auth/me",     desc: "Get the current user's profile", auth: "JWT" },
  { method: "POST", color: "success", path: "/api/v1/urls",         desc: "Create a short link", auth: "Optional" },
  { method: "GET",  color: "primary", path: "/api/v1/urls",         desc: "List your links (paginated, filterable)", auth: "JWT" },
  { method: "GET",  color: "primary", path: "/api/v1/urls/:id",     desc: "Get details for a single link", auth: "JWT" },
  { method: "PUT",  color: "warning", path: "/api/v1/urls/:id",     desc: "Update a link's title, URL, or status", auth: "JWT" },
  { method: "DELETE", color: "danger", path: "/api/v1/urls/:id",    desc: "Permanently delete a link", auth: "JWT" },
  { method: "GET",  color: "primary", path: "/api/v1/urls/:code/qr",desc: "Get the QR code image for a link", auth: "Optional" },
  { method: "GET",  color: "primary", path: "/api/v1/dashboard/stats", desc: "Aggregated analytics and cache metrics", auth: "JWT" },
  { method: "POST", color: "success", path: "/api/v1/dashboard/cache/clear", desc: "Flush the in-memory cache", auth: "JWT" },
  { method: "GET",  color: "secondary", path: "/:code",             desc: "Redirect to the original URL", auth: "—" },
  { method: "GET",  color: "secondary", path: "/health",            desc: "Service health status", auth: "—" }
];

export default function AboutPage() {
  return (
    <div className="about-page py-5">
      <div className="container" style={{ maxWidth: "940px" }}>

        {/* Hero */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary small fw-semibold mb-3">
            <Code2 size={15} /> Self-Hosted URL Shortener
          </div>
          <h1 className="display-5 fw-bold mb-3">
            About <span className="text-primary">ShortX</span>
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: 620 }}>
            ShortX is an open-source URL shortener built with Node.js and React.
            It offers fast link redirects, per-link click analytics, QR code generation,
            and a full link management dashboard — all without third-party dependencies for core functionality.
          </p>
          <Link to="/" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2">
            Try it now <ArrowRight size={16} />
          </Link>
        </div>

        {/* Architecture */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-1">
              <Server size={20} className="text-primary" />
              <h4 className="fw-bold mb-0">How It Works</h4>
            </div>
            <p className="text-muted small mb-4">
              The service has four distinct layers. Requests flow through each layer in sequence.
            </p>

            <div className="row g-3 mb-4">
              {[
                {
                  step: "1",
                  label: "Browser (Client)",
                  desc: "The React single-page application runs in the browser. It communicates with the backend API for all data operations.",
                  color: "primary"
                },
                {
                  step: "2",
                  label: "API Server",
                  desc: "An Express.js server handles authentication, link management, analytics aggregation, and redirect logic on port 3000.",
                  color: "success"
                },
                {
                  step: "3",
                  label: "Link Cache",
                  desc: "An in-process key/value store holds the most recently resolved links. A redirect that hits the cache never touches the database.",
                  color: "warning"
                },
                {
                  step: "4",
                  label: "Database",
                  desc: "MongoDB stores all user accounts, links, and per-click analytics records. Indexed on short code and user ID for fast lookups.",
                  color: "danger"
                }
              ].map((s) => (
                <div className="col-12 col-sm-6" key={s.step}>
                  <div className={`p-3 rounded-3 h-100 border border-${s.color}-subtle`} style={{ backgroundColor: "var(--bg-app)" }}>
                    <span className={`badge bg-${s.color} mb-2`}>Layer {s.step}</span>
                    <div className="fw-bold mb-1">{s.label}</div>
                    <div className="small text-muted">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Redirect flow */}
            <div className="rounded-3 p-3 border" style={{ backgroundColor: "var(--bg-app)" }}>
              <p className="fw-semibold small mb-2">Redirect flow — what happens when someone visits a short link:</p>
              <div className="small text-muted">
                <div className="mb-1">
                  <span className="badge bg-primary-subtle text-primary me-1">1</span>
                  Browser requests <code>GET /abc123</code>
                </div>
                <div className="mb-1">
                  <span className="badge bg-success-subtle text-success me-1">2</span>
                  Server checks the in-process cache for <code>abc123</code>
                </div>
                <div className="mb-1">
                  <span className="badge bg-warning-subtle text-warning me-1">Cache hit</span>
                  Returns a <code>302</code> redirect immediately — no database query
                </div>
                <div className="mb-1">
                  <span className="badge bg-danger-subtle text-danger me-1">Cache miss</span>
                  Queries the database, stores the result in cache, then returns <code>302</code>
                </div>
                <div>
                  <span className="badge bg-secondary-subtle text-secondary me-1">Always</span>
                  Click data (device, browser, referrer) is recorded after the response is sent — it never delays the redirect
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">Features</h4>
          </div>
          <div className="row g-3">
            {FEATURES.map((f, i) => (
              <div className="col-12 col-md-6" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-3 d-flex gap-3">
                    <div className="mt-1 flex-shrink-0">{f.icon}</div>
                    <div>
                      <div className="fw-semibold mb-1">{f.title}</div>
                      <div className="small text-muted">{f.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <GitBranch size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">Technology Stack</h4>
          </div>
          <div className="row g-4">
            {TECH_STACK.map((group) => (
              <div className="col-12 col-md-6" key={group.category}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 pb-0 pt-3 px-3">
                    <span className={`badge bg-${group.color} rounded-pill px-3`}>{group.category}</span>
                  </div>
                  <div className="card-body p-3">
                    <div className="list-group list-group-flush">
                      {group.items.map((item) => (
                        <div
                          key={item.name}
                          className="list-group-item bg-transparent px-0 py-2 border-0 d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-semibold small">{item.name}</span>
                          <span className="text-muted small">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <Database size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">API Reference</h4>
          </div>
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-uppercase text-muted" style={{ fontSize: "0.72rem" }}>
                    <th className="ps-4">Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {API_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td className="ps-4">
                        <span className={`badge bg-${row.color}-subtle text-${row.color} font-monospace`}>
                          {row.method}
                        </span>
                      </td>
                      <td>
                        <code className="text-muted small">{row.path}</code>
                      </td>
                      <td className="text-muted">{row.desc}</td>
                      <td>
                        {row.auth === "JWT" ? (
                          <span className="badge bg-primary-subtle text-primary small">Required</span>
                        ) : row.auth === "Optional" ? (
                          <span className="badge bg-secondary-subtle text-secondary small">Optional</span>
                        ) : (
                          <span className="text-muted small">Public</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card border-0 shadow-sm p-4 text-center" style={{ background: "var(--accent-gradient)" }}>
          <h5 className="fw-bold text-white mb-2">Ready to shorten your first link?</h5>
          <p className="mb-3 small" style={{ color: "rgba(255,255,255,0.75)" }}>
            No account needed to get started.
          </p>
          <Link to="/" className="btn btn-light btn-sm px-4 d-inline-flex align-items-center gap-2 fw-semibold">
            <Zap size={15} /> Get Started
          </Link>
        </div>

      </div>
    </div>
  );
}
