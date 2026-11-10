import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy - ShortX";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link to="/" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-5 border-bottom pb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary small fw-semibold mb-2">
            <Shield size={16} /> Legal & Compliance
          </div>
          <h1 className="fw-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted small mb-0">
            Last Updated: November 10, 2026 • Effective Immediately
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content d-flex flex-column gap-4">
          <section>
            <h4 className="fw-bold mb-2">1. Overview</h4>
            <p className="text-muted leading-relaxed">
              At ShortX ("we", "our", or "us"), we are committed to respecting and protecting the privacy of our visitors, registered users, and individuals who click on links shortened through our service. This Privacy Policy outlines what information we collect, how it is used, and your rights regarding your personal data.
            </p>
          </section>

          <section>
            <h4 className="fw-bold mb-2">2. Information We Collect</h4>
            <div className="text-muted leading-relaxed">
              <p>We collect information in the following categories:</p>
              <ul>
                <li className="mb-2">
                  <strong>Account Information:</strong> When you register for an account, we collect your full name, email address, and a securely salted and hashed password. We never store plain-text passwords.
                </li>
                <li className="mb-2">
                  <strong>URL Data:</strong> The destination URLs you shorten, custom slugs, campaign titles, and expiration dates.
                </li>
                <li className="mb-2">
                  <strong>Click & Redirection Telemetry:</strong> When an internet user visits a ShortX link, our server records non-personally identifiable diagnostic information including the timestamp, HTTP referrer header (traffic origin), device category (Desktop, Mobile, Tablet), browser type, operating system, and an anonymized IP address strictly for aggregated metrics.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h4 className="fw-bold mb-2">3. Google AdSense & Third-Party Advertising</h4>
            <div className="text-muted leading-relaxed">
              <p>
                We use Google AdSense to serve advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads based on prior visits to our site or other websites on the internet.
              </p>
              <ul>
                <li className="mb-2">
                  Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </li>
                <li className="mb-2">
                  Users may opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Google Ads Settings
                  </a>.
                </li>
                <li className="mb-2">
                  Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
              <p>
                For more details on how Google uses data when you use our website, please review{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  How Google uses information from sites or apps that use our services
                </a>.
              </p>
            </div>
          </section>

          <section>
            <h4 className="fw-bold mb-2">4. How We Use Your Information</h4>
            <div className="text-muted leading-relaxed">
              <p>Your information is used solely for the following legitimate purposes:</p>
              <ul>
                <li>To generate, manage, and safely redirect shortened URLs.</li>
                <li>To provide engagement analytics and click counts in your personal dashboard.</li>
                <li>To safeguard the platform against abuse, spamming, phishing, and DDoS attacks via rate limiting.</li>
                <li>To authenticate your login sessions via secure JSON Web Tokens.</li>
              </ul>
            </div>
          </section>

          <section>
            <h4 className="fw-bold mb-2">5. Data Retention & Security</h4>
            <p className="text-muted leading-relaxed">
              We employ industry-standard security measures, including HTTPS encryption, password hashing with bcrypt, strict HTTP security headers (Helmet), and scoped database queries to protect your data. URLs and associated click telemetry are retained as long as your account remains active or until you delete the link through the Links Manager.
            </p>
          </section>

          <section>
            <h4 className="fw-bold mb-2">6. Your Rights</h4>
            <p className="text-muted leading-relaxed">
              You have the right to access the personal information we hold about you, request corrections, or delete your shortened links and account at any time. To exercise these rights or ask questions regarding this policy, contact our privacy team at <span className="text-primary fw-semibold">privacy@shortx.io</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
