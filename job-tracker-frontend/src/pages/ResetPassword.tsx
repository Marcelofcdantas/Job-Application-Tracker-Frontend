import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrength from "../components/PasswordStrength";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Invalid link");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset/confirm", {
        token,
        newPassword: password,
      });

      setMessage("Password updated successfully");

      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Reset Password">
      <div className="center-page">
        <section className="single-column-card reset-card">
          <h2 className="hero-title">Reset Password</h2>

          <form className="stack" onSubmit={handleSubmit}>
            <div className="input-group">
              <span>New Password</span>
              <div className="input-with-icon">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="icon-right" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div className="input-group">
              <span>Confirm Password</span>
              <div className="input-with-icon">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <span
                  className="icon-right"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <button className="primary-button" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {message && <p className="feedback-message">{message}</p>}
        </section>
      </div>
    </PageShell>
  );
}
