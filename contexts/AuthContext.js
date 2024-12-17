"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await api.get("/user");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("auth_token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      scheduleAutoLogout(2 * 60 * 60 * 1000); // 2 hours
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/logout");
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      clearAutoLogout();
      router.push("/"); // Ensure client-side navigation
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const scheduleAutoLogout = (timeout) => {
    clearAutoLogout();
    const timer = setTimeout(() => {
      logout();
    }, timeout);
    setLogoutTimer(timer);
  };

  const clearAutoLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  useEffect(() => {
    return () => clearAutoLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
