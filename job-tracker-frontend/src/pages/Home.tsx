import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Home() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", { email, password, rememberMe });
      login(res.data.token, rememberMe);

      setMessage("Check your email to access your account.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Welcome">
      <div className="premium-auth-layout">
        <div className="ambient-orb ambient-orb-left" />
        <div className="ambient-orb ambient-orb-right" />

        <section className="single-column-card premium-card">
          <div className="premium-card-glow" />

          <div className="hero-block">
            <span className="eyebrow-badge">Career workflow, simplified</span>
            <h2 className="hero-title">Welcome to Job Tracker Application</h2>

            <p className="hero-subtitle">
              Track your job applications in one place!
            </p>
          </div>

          <div className="feature-list premium-feature-list">
            <div className="feature-item premium-feature-item">
              <div className="feature-icon premium-feature-icon">📋</div>
              <div>
                <h4>Organize Your Job Search</h4>
                <p>Manage and track all your applications in one clean workspace.</p>
              </div>
            </div>

            <div className="feature-item premium-feature-item">
              <div className="feature-icon premium-feature-icon">📊</div>
              <div>
                <h4>Monitor Your Progress</h4>
                <p>See each application status and follow your process more clearly.</p>
              </div>
            </div>

            <div className="feature-item premium-feature-item">
              <div className="feature-icon premium-feature-icon">✅</div>
              <div>
                <h4>Stay Updated</h4>
                <p>Keep notes, reminders, interviews, and changes organized in one place.</p>
              </div>
            </div>
          </div>

          <div className="divider premium-divider" />

          <form className="stack premium-form" onSubmit={handleLogin}>
            <h3 className="section-title">Login in Your Account</h3>

            <label className="input-group premium-input-group">
              <span>Email</span>
              <input
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="input-group premium-input-group">
              <span>Password</span>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="remember-forgot">
              <label className="remember-row">
                <input type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <span>Remember Me</span>
              </label>

              <Link className="forgot-link" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="primary-button premium-button" disabled={loading}>
              <span>{loading ? "Signing in..." : "Login"}</span>
            </button>

            <button
              className="secondary-button premium-secondary-button"
              type="button"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </form>

          {message && (
            <p className="feedback-message premium-feedback">
              {message}
            </p>
          )}
        </section>
      </div>
    </PageShell>
  );
}