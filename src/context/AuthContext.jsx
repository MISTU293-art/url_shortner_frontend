import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("shortx_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shortx_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync state with backend profile
  useEffect(() => {
    let isMounted = true;
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("shortx_token");
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await apiService.getMe();
        if (isMounted) {
          setUser(response.data);
          localStorage.setItem("shortx_user", JSON.stringify(response.data));
        }
      } catch {
        // Token expired or invalid
        if (isMounted) {
          localStorage.removeItem("shortx_token");
          localStorage.removeItem("shortx_user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await apiService.login({ email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    localStorage.setItem("shortx_token", receivedToken);
    localStorage.setItem("shortx_user", JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await apiService.register({ name, email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    localStorage.setItem("shortx_token", receivedToken);
    localStorage.setItem("shortx_user", JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch {
      // Ignore logout network failure
    } finally {
      localStorage.removeItem("shortx_token");
      localStorage.removeItem("shortx_user");
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
