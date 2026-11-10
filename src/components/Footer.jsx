import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Database, Zap, Lock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-12 col-md-5 text-center text-md-start">
            <span className="fw-bold">ShortX</span>
            <span className="text-muted small ms-2">
              © {currentYear} ShortX. All rights reserved.
            </span>
          </div>

          <div className="col-12 col-md-7">
            <div className="d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-3 small">
              <Link to="/privacy-policy" className="text-muted text-decoration-none hover-primary">
                Privacy Policy
              </Link>
              <span className="text-muted">•</span>
              <Link to="/cookie-policy" className="text-muted text-decoration-none hover-primary">
                Cookie Policy
              </Link>
              <span className="text-muted">•</span>
              <Link to="/dashboard" className="text-muted text-decoration-none hover-primary">
                Dashboard
              </Link>
              <span className="text-muted">•</span>
              <span className="text-muted small d-inline-flex align-items-center gap-1">
                <Lock size={12} className="text-success" /> SSL Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
