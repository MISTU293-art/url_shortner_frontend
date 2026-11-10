import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Tag,
  Share2,
  AlertCircle
} from "lucide-react";
import apiService from "../services/api";
import { useToast } from "../context/ToastContext";
import QrModal from "../components/QrModal";

const RESERVED_SLUGS = new Set([
  "api", "health", "dashboard", "urls", "admin", "login", "register",
  "auth", "static", "public", "assets", "favicon.ico", "robots.txt", "s",
  "ads.txt", "sitemap.xml", "privacy-policy", "cookie-policy", "about", "terms"
]);

export default function ShortenPage() {
  const { showToast } = useToast();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [title, setTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [selectedQr, setSelectedQr] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);

  const validateInput = () => {
    let cleanUrl = originalUrl.trim();
    if (!cleanUrl) {
      setError("Please enter a URL to shorten.");
      return null;
    }

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        setError("Please enter a valid URL with a proper domain (e.g. example.com).");
        return null;
      }
      if (parsed.hostname === window.location.hostname) {
        setError("You cannot shorten a URL that points back to this service.");
        return null;
      }
    } catch {
      setError("Invalid URL format. Please check the address and try again.");
      return null;
    }

    if (customAlias.trim()) {
      const slug = customAlias.trim().toLowerCase();
      if (slug.length < 3 || slug.length > 30) {
        setError("Custom alias must be between 3 and 30 characters.");
        return null;
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
        setError("Custom alias may only contain letters, numbers, hyphens, and underscores.");
        return null;
      }
      if (RESERVED_SLUGS.has(slug)) {
        setError(`The alias "${slug}" is reserved. Please choose a different one.`);
        return null;
      }
    }

    if (expiresAt) {
      const expDate = new Date(expiresAt);
      if (isNaN(expDate.getTime()) || expDate <= new Date()) {
        setError("Expiration date must be in the future.");
        return null;
      }
    }

    return cleanUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validUrl = validateInput();
    if (!validUrl) return;

    setLoading(true);
    setCopied(false);

    try {
      const payload = { original_url: validUrl };
      if (customAlias.trim()) payload.custom_alias = customAlias.trim().toLowerCase();
      if (title.trim()) payload.title = title.trim();
      if (expiresAt) payload.expires_at = new Date(expiresAt).toISOString();

      const response = await apiService.shortenUrl(payload);
      const urlData = response.data;

      setResult(urlData);
      setRecentLinks((prev) =>
        [urlData, ...prev.filter((item) => item._id !== urlData._id)].slice(0, 5)
      );
      showToast("Short link created successfully!", "success");

      setOriginalUrl("");
      setCustomAlias("");
      setTitle("");
      setExpiresAt("");
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (linkData) => {
    if (navigator.share) {
      navigator
        .share({ title: linkData.title || "Short link", url: linkData.full_short_url })
        .catch(() => {});
    } else {
      handleCopy(linkData.full_short_url);
    }
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* Hero */}
        <div className="text-center mb-5 hero-section">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary small fw-semibold mb-3">
            <Zap size={16} /> Fast &amp; Reliable URL Shortener
          </div>
          <h1 className="display-5 fw-bold mb-3 tracking-tight">
            Shorten, Share &amp; <span className="text-gradient">Track Your Links</span>
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "1.05rem" }}>
            Create short links with custom aliases and monitor clicks in your personal dashboard.
          </p>
        </div>

        {/* Shortener Card */}
        <div className="card border-0 shadow-lg shortener-card mb-4">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit} noValidate>
              <div className="main-input-wrapper mb-3">
                <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                  <span className="input-group-text bg-body border-0 ps-3">
                    <Link2 className="text-primary" size={24} />
                  </span>
                  <input
                    type="url"
                    required
                    value={originalUrl}
                    onChange={(e) => {
                      setOriginalUrl(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Paste your long URL here…"
                    className="form-control border-0 py-3 fs-6"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || !originalUrl.trim()}
                    className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <>
                        <span>Shorten</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced toggle */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="btn btn-link text-decoration-none text-muted small p-0 d-flex align-items-center gap-1"
                >
                  <SlidersHorizontal size={14} />
                  <span>{showAdvanced ? "Hide options" : "Options (alias, expiry, label)"}</span>
                </button>
                {originalUrl && (
                  <button
                    type="button"
                    onClick={() => { setOriginalUrl(""); setError(""); }}
                    className="btn btn-link text-decoration-none text-muted small p-0"
                  >
                    Clear
                  </button>
                )}
              </div>

              {showAdvanced && (
                <div className="advanced-options-panel mt-3 pt-3 border-top">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                        <Tag size={14} className="text-primary" /> Custom Alias
                      </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text text-muted bg-body">/</span>
                        <input
                          type="text"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                          placeholder="my-link"
                          className="form-control"
                          maxLength={30}
                        />
                      </div>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        3–30 characters: letters, numbers, hyphens, underscores
                      </span>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                        <Calendar size={14} className="text-primary" /> Expiration Date
                      </label>
                      <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="form-control form-control-sm"
                      />
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Link stops working after this date
                      </span>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">
                        Link Label <span className="text-muted fw-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Product launch, Blog post"
                        className="form-control form-control-sm"
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>

            {error && (
              <div className="alert alert-danger mt-3 py-2 small d-flex align-items-center gap-2 rounded-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div className="card border-0 shadow-md result-card mb-4 animate-slide-up">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">
                      Active
                    </span>
                    {result.custom_alias && (
                      <span className="badge bg-info-subtle text-info rounded-pill px-2 py-1 small">
                        Custom Alias
                      </span>
                    )}
                  </div>

                  <h4 className="fw-bold mb-1 text-primary text-truncate">
                    <a
                      href={result.full_short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {result.full_short_url}
                    </a>
                  </h4>

                  <p className="text-muted small text-truncate mb-0" title={result.original_url}>
                    → {result.original_url}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleCopy(result.full_short_url)}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    onClick={() => setSelectedQr(result)}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                  >
                    <QrCode size={16} />
                    <span>QR Code</span>
                  </button>

                  <button
                    onClick={() => handleShare(result)}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>

                  <a
                    href={result.full_short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                  >
                    <ExternalLink size={16} />
                    <span>Visit</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Links */}
        {recentLinks.length > 0 && (
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3 pb-0">
              <h6 className="fw-bold mb-0 text-muted text-uppercase small" style={{ letterSpacing: "0.06em" }}>
                Links created this session
              </h6>
              <Link to="/links" className="small text-decoration-none">
                View all →
              </Link>
            </div>
            <div className="card-body p-3">
              <div className="list-group list-group-flush">
                {recentLinks.map((item) => (
                  <div
                    key={item._id}
                    className="list-group-item bg-transparent px-0 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2"
                  >
                    <div className="overflow-hidden">
                      <div className="fw-semibold text-truncate">{item.title || item.short_url}</div>
                      <a
                        href={item.full_short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small text-primary text-decoration-none"
                      >
                        {item.full_short_url}
                      </a>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.full_short_url)}
                        className="btn btn-sm btn-outline-secondary p-1 px-2 d-flex align-items-center gap-1"
                      >
                        <Copy size={14} /> Copy
                      </button>
                      <button
                        onClick={() => setSelectedQr(item)}
                        className="btn btn-sm btn-outline-secondary p-1 px-2 d-flex align-items-center gap-1"
                      >
                        <QrCode size={14} /> QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="row g-4 pt-4 border-top">
          <div className="col-12 col-md-4">
            <div className="feature-box p-3 rounded-3 text-center text-md-start">
              <div className="feature-icon mb-2 text-warning"><Zap size={24} /></div>
              <h6 className="fw-bold">Link Caching</h6>
              <p className="small text-muted mb-0">
                Frequently visited links resolve from memory, keeping redirects fast.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="feature-box p-3 rounded-3 text-center text-md-start">
              <div className="feature-icon mb-2 text-success"><ShieldCheck size={24} /></div>
              <h6 className="fw-bold">Abuse Protection</h6>
              <p className="small text-muted mb-0">
                Rate limits and input validation keep the service reliable for everyone.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="feature-box p-3 rounded-3 text-center text-md-start">
              <div className="feature-icon mb-2 text-info"><BarChart3 size={24} /></div>
              <h6 className="fw-bold">Click Analytics</h6>
              <p className="small text-muted mb-0">
                Track clicks, devices, and referrers from your personal dashboard.
              </p>
            </div>
          </div>
        </div>

        <QrModal
          isOpen={Boolean(selectedQr)}
          onClose={() => setSelectedQr(null)}
          urlData={selectedQr}
        />
      </div>
    </div>
  );
}
