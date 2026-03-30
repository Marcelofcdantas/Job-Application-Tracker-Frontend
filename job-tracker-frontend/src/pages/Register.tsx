import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/register", { email, password });

      setMessage("Account created successfully! Check your email.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Error creating account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Create Account">
      <div className="center-page">
        <section className="single-column-card">
          <h2 className="hero-title">Create Your Account</h2>

          <form className="stack" onSubmit={handleSubmit}>
            <label className="input-group">
              <span>Email</span>
              <input
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="input-group">
              <span>Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {message && (
            <p className="feedback-message">
              {message}
            </p>
          )}
        </section>
      </div>
    </PageShell>
  );
}