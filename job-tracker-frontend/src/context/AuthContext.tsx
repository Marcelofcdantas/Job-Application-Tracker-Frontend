
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState(
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );

  function login(t: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem("token", t);
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("token", t);
    localStorage.removeItem("token");
  }

  setToken(t);
}

  function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
