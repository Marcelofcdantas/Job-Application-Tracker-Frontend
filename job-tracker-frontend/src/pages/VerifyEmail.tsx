import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      return;
    }

    api.post("/auth/verify-email", { token })
      .then((res) => {
        localStorage.setItem("token", res.data.data.accessToken);
        sessionStorage.removeItem("token");
        navigate("/applications");
      })
      .catch(() => {
        alert("Invalid or expired link");
        navigate("/");
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Logging you in...</h2>
    </div>
  );
}
