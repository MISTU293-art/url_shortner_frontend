import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, Settings, CheckCircle, ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  useEffect(() => {
    document.title = "Cookie Policy - ShortX";
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
            <Cookie size={16} /> Cookie Disclosure
          </div>
          <h1 className="fw-bold tracking-tight">Cookie Policy</h1>
          <p className="text-muted small mb-0">
            Last Updated: November 10, 2026 • Compliant with Google AdSense Policies
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content d-flex flex-column gap-4">
          <section>
            <h4 className="fw-bold mb-2">1. What Are Cookies?</h4>
            <p className="text-muted leading-relaxed">
              Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites work efficiently, remember your preferences, and provide analytical or advertising information to site operators.
            </p>
          </section>

          <section>
            <h4 className="fw-bold mb-2">2. How ShortX Uses Cookies</h4>
            <div className="text-muted leading-relaxed">
              <p>We categorize the cookies and local storage tokens used on our platform into three types:</p>

              <div className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary">
                <h6 className="fw-bold text-main mb-1">A. Essential Authentication Cookies & Storage</h6>
                <p className="small mb-0">
                  These are necessary for the website to function. They keep you logged into your account across page navigations (e.g. your session token). You cannot turn these off if you wish to use authenticated features such as the Dashboard.
                </p>
              </div>

              <div className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary">
                <h6 className="fw-bold text-main mb-1">B. Functional & Preference Cookies</h6>
                <p className="small mb-0">
                  These remember your display preferences, such as whether you have chosen Dark Mode or Light Mode (stored in <code>localStorage</code> under <code>shortx_theme</code>), and your cookie consent preference.
                </p>
              </div>

              <div className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary">
                <h6 className="fw-bold text-main mb-1">C. Google AdSense & Third-Party Advertising Cookies</h6>
                <p className="small mb-0">
                  Google AdSense uses cookies (such as DoubleClick cookies) to serve ads based on prior visits to our site or other websites. These cookies allow Google and its certified ad partners to serve ads that are relevant to you, limit the number of times you see an ad, and measure the effectiveness of advertising campaigns.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="fw-bold mb-2">3. How to Manage and Disable Cookies</h4>
            <div className="text-muted leading-relaxed">
              <p>
                You can control and/or delete cookies as you wish. Most web browsers allow you to modify your cookie settings to refuse cookies or alert you when cookies are being sent:
              </p>
              <ul>
                <li className="mb-1">
                  <strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies
                </li>
                <li className="mb-1">
                  <strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection
                </li>
                <li className="mb-1">
                  <strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies
                </li>
                <li className="mb-1">
                  <strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions
                </li>
              </ul>
              <p>
                To specifically manage or opt out of Google AdSense personalized advertising cookies, visit the{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  Google Ads Settings portal
                </a>.
              </p>
            </div>
          </section>

          <section>
            <h4 className="fw-bold mb-2">4. Changes to This Cookie Policy</h4>
            <p className="text-muted leading-relaxed">
              We may update this policy periodically to reflect changes in our technology or legal requirements. Continued use of our site after updates constitutes acceptance of the modified policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
