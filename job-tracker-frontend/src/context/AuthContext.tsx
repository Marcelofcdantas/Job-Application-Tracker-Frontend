import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  emailForMfa: string;
  setEmailForMfa: (email: string) => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [emailForMfa, setEmailForMfa] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  function login(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setEmailForMfa("");
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      emailForMfa,
      setEmailForMfa,
      login,
      logout,
    }),
    [isAuthenticated, emailForMfa]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
