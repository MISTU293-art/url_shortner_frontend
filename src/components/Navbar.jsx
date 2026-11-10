import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Link2,
  LayoutDashboard,
  ListFilter,
  Info,
  Moon,
  Sun,
  Zap,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Lock,
  ChevronRight
} from "lucide-react";
import apiService from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const [isServerHealthy, setIsServerHealthy] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Periodic API health ping
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        await apiService.checkHealth();
        if (alive) setIsServerHealthy(true);
      } catch {
        if (alive) setIsServerHealthy(false);
      }
    };
    ping();
    const id = setInterval(ping, 15000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("Signed out successfully", "info");
    navigate("/");
  };

  const navLinks = [
    { to: "/",          label: "Shorten",       icon: <Link2 size={18} />,          requiresAuth: false },
    { to: "/dashboard", label: "Dashboard",     icon: <LayoutDashboard size={18} />, requiresAuth: true  },
    { to: "/links",     label: "Links",          icon: <ListFilter size={18} />,      requiresAuth: true  },
    { to: "/about",     label: "About",          icon: <Info size={18} />,            requiresAuth: false }
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom sticky-top app-navbar py-2">
        <div className="container">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="btn btn-outline-secondary btn-sm d-lg-none me-2 p-2 border-0"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-decoration-none">
            <div className="brand-icon-box">
              <Zap size={20} className="text-white" />
            </div>
            <span className="brand-text">
              Short<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to} className="nav-item">
                    <Link
                      to={link.to}
                      className={`nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                        isActive ? "active-nav-link fw-semibold" : "text-secondary"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      {link.requiresAuth && !isAuthenticated && (
                        <Lock size={12} className="text-muted" title="Sign in required" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Health badge */}
            <div
              className={`badge d-none d-sm-flex align-items-center gap-1 px-2 py-1 rounded-pill ${
                isServerHealthy === true
                  ? "bg-success-subtle text-success"
                  : isServerHealthy === false
                  ? "bg-danger-subtle text-danger"
                  : "bg-secondary-subtle text-secondary"
              }`}
              title="Service status"
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  backgroundColor: isServerHealthy ? "#10b981" : isServerHealthy === false ? "#ef4444" : "#94a3b8"
                }}
              />
              <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                {isServerHealthy === true ? "Online" : isServerHealthy === false ? "Offline" : "…"}
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Desktop auth */}
            <div className="d-none d-lg-flex align-items-center gap-2 ms-1">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-body border">
                    <div className="user-avatar-pill">
                      {user?.name ? user.name[0].toUpperCase() : <User size={14} />}
                    </div>
                    <span className="small fw-semibold pe-1" style={{ maxWidth: 100 }} title={user?.name}>
                      {user?.name?.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2 py-1 rounded-3"
                    title="Sign out"
                  >
                    <LogOut size={15} />
                    <span className="small">Sign out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-1 rounded-3">
                    Sign in
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm px-3 py-1 rounded-3">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={`mobile-sidebar-backdrop ${mobileDrawerOpen ? "open" : ""}`}
        onClick={() => setMobileDrawerOpen(false)}
      />

      {/* Mobile sidebar drawer */}
      <aside className={`mobile-sidebar-drawer ${mobileDrawerOpen ? "open" : ""}`}>
        {/* Drawer header */}
        <div className="mobile-drawer-header">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Zap size={18} />
            </div>
            <span className="fw-bold fs-5">
              Short<span className="text-primary">X</span>
            </span>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Auth section in drawer */}
        <div className="p-3 border-bottom bg-body-tertiary">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <div className="user-avatar-pill" style={{ width: 42, height: 42, fontSize: "1.1rem" }}>
                {user?.name ? user.name[0].toUpperCase() : <User size={18} />}
              </div>
              <div className="overflow-hidden">
                <div className="fw-bold text-truncate">{user?.name}</div>
                <div className="small text-muted text-truncate">{user?.email}</div>
                <span className="badge bg-primary-subtle text-primary rounded-pill small mt-1">
                  {user?.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="small text-muted mb-2">Sign in to access your dashboard</div>
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                >
                  <LogIn size={15} /> Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                >
                  <UserPlus size={15} /> Sign up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="py-3 flex-grow-1">
          <div className="px-3 pb-2 text-uppercase text-muted small fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileDrawerOpen(false)}
                className={`mobile-nav-link ${isActive ? "active" : ""}`}
              >
                <span>{link.icon}</span>
                <span className="flex-grow-1">{link.label}</span>
                {link.requiresAuth && !isAuthenticated ? (
                  <span className="badge bg-secondary-subtle text-secondary small py-1 px-2 d-flex align-items-center gap-1">
                    <Lock size={11} /> Login
                  </span>
                ) : (
                  <ChevronRight size={16} className="text-muted" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-top mt-auto">
          <div className="d-flex align-items-center justify-content-between mb-3 px-2">
            <span className="small text-muted">Theme</span>
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm px-3 d-flex align-items-center gap-1 rounded-pill"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              <span className="small">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => { setMobileDrawerOpen(false); handleLogout(); }}
              className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
