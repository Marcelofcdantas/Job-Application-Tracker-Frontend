import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PageShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-overline">Job Tracker Application</p>
          <h1 className="brand-title">{title}</h1>
        </div>

        <nav className="topnav">
          <Link className={location.pathname === "/" ? "active-link" : ""} to="/">
            Home
          </Link>
          <Link
            className={location.pathname === "/applications" ? "active-link" : ""}
            to="/applications"
          >
            Applications
          </Link>
          <Link
            className={location.pathname === "/settings" ? "active-link" : ""}
            to="/settings"
          >
            Settings
          </Link>
          <Link
            className={location.pathname === "/forgot-password" ? "active-link" : ""}
            to="/forgot-password"
          >
            Forgot Password
          </Link>

          {isAuthenticated ? (
            <button className="text-button" onClick={logout}>
              Logout
            </button>
          ) : null}
        </nav>
      </header>

      <main className="page-wrap">{children}</main>
    </div>
  );
}
