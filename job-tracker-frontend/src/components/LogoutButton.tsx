import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button className="logout-button" onClick={logout}>
      Logout
    </button>
  );
}