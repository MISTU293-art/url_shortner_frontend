import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: "400px"
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-alert toast-${toast.type}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1.25rem",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
              animation: "slideInRight 0.25s ease-out forwards",
              background: toast.type === "success" 
                ? "linear-gradient(135deg, #059669 0%, #10b981 100%)" 
                : toast.type === "error" 
                ? "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" 
                : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              color: "#ffffff",
              fontSize: "0.925rem",
              fontWeight: 500
            }}
          >
            {toast.type === "success" && <CheckCircle2 size={20} />}
            {toast.type === "error" && <AlertCircle size={20} />}
            {toast.type === "info" && <Info size={20} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                padding: 0,
                display: "flex"
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
