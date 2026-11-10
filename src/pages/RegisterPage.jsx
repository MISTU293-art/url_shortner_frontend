import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      showToast("Account created successfully! Welcome to ShortX.", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "460px" }}>
        <div className="card border-0 shadow-lg p-3 p-sm-4">
          <div className="card-body">
            {/* Header / Brand */}
            <div className="text-center mb-4">
              <div className="brand-icon-box mx-auto mb-3" style={{ width: 44, height: 44 }}>
                <Zap size={24} />
              </div>
              <h3 className="fw-bold mb-1">Create an Account</h3>
              <p className="text-muted small">
                Unlock personal dashboard analytics, custom aliases, and link management
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
              {/* Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0 text-muted">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="form-control border-start-0"
                    autoFocus
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0 text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
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

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0 text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="form-control border-start-0"
                  />
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
                    <UserPlus size={18} />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer switch */}
            <div className="text-center pt-3 border-top">
              <span className="small text-muted">Already have an account? </span>
              <Link to="/login" className="small fw-semibold text-decoration-none text-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
