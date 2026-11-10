import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("shortx_cookie_consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("shortx_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("shortx_cookie_consent", "essential_only");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position:  "fixed",
        bottom:    "1rem",
        left:      "1rem",
        right:     "1rem",
        maxWidth:  "640px",
        margin:    "0 auto",
        zIndex:    9000,
        animation: "slideUp 0.35s ease-out"
      }}
    >
      <div className="card border-0 shadow-lg p-3 p-sm-4" style={{ borderRadius: "1rem" }}>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <div className="p-2 rounded-3 bg-primary-subtle text-primary flex-shrink-0 d-none d-sm-flex align-items-center">
              <Cookie size={22} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">We use cookies</h6>
              <p className="small text-muted mb-0" style={{ lineHeight: 1.5 }}>
                This site uses cookies to remember your preferences (theme, session) and to keep you signed in. No tracking or advertising cookies are used.{" "}
                <Link to="/cookie-policy" className="fw-semibold text-decoration-none">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="btn btn-outline-secondary btn-sm px-3 rounded-3"
            >
              Essential only
            </button>
            <button
              onClick={accept}
              className="btn btn-primary btn-sm px-3 rounded-3 fw-semibold"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
