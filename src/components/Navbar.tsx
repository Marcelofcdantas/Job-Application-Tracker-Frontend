import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        
        <Link to="/applications" className="logo">
          <img src="/logo_transparent.png" alt="JobTracker logo" />
          <span>JobTracker</span>
        </Link>

        <div className="nav-links desktop">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/applications" className={isActive("/applications")}>Applications</Link>
          <Link to="/applications/archived">Archived</Link>
          <Link to="/analytics" className={isActive("/analytics")}>Analytics</Link>
          <Link to="/settings" className={isActive("/settings")}>Settings</Link>

          <LogoutButton />
        </div>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/applications" onClick={() => setOpen(false)}>Applications</Link>
          <Link to="/applications/archived" onClick={() => setOpen(false)}>Archived</Link>
          <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link>

          <LogoutButton />
        </div>
      )}
    </nav>
  );
}