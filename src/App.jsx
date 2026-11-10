import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShortenPage from "./pages/ShortenPage";
import DashboardPage from "./pages/DashboardPage";
import LinksPage from "./pages/LinksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import CookieBanner from "./components/CookieBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("shortx_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("shortx_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main className="main-content">
              <Routes>
                {/* Public */}
                <Route path="/" element={<ShortenPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />

                {/* Protected */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/links"
                  element={
                    <ProtectedRoute>
                      <LinksPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
