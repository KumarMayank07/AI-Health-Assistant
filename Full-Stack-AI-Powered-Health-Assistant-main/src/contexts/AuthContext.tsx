import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "@/lib/api";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "doctor";
  profileImage?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // Add this line
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Add this line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          apiService.setToken(savedToken);
          setToken(savedToken); // Add this line
          setUser(JSON.parse(savedUser));

          // Verify token is still valid
          try {
            const { user: currentUser } = await apiService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.error("Token validation failed:", error);
            await logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      setToken(response.token || localStorage.getItem("token")); // Add this line
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
      setToken(response.token || localStorage.getItem("token")); // Add this line
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await apiService.adminLogin(email, password);
      setUser(response.user);
      setToken(response.token || localStorage.getItem("token")); // Add this line
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null); // Add this line
    }
  };

  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token, // Add this line
    loading,
    login,
    register,
    adminLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};