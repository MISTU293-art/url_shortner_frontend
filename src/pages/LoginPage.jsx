import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("redirect") ? "Please sign in to access your dashboard." : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      showToast("Signed in successfully!", "success");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="card border-0 shadow-lg p-3 p-sm-4">
          <div className="card-body">
            {/* Header / Brand */}
            <div className="text-center mb-4">
              <div className="brand-icon-box mx-auto mb-3" style={{ width: 44, height: 44 }}>
                <Zap size={24} />
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small">
                Sign in to manage your short links and access your live dashboard
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 rounded-3 mb-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0 text-muted">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-control border-start-0"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0 text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control border-start-0 border-end-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-outline-secondary border-start-0 bg-body text-muted"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer switch */}
            <div className="text-center pt-3 border-top">
              <span className="small text-muted">Don't have an account yet? </span>
              <Link to="/register" className="small fw-semibold text-decoration-none text-primary">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
