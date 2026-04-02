import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.verified) {
      setMessage("Email verified! You can now log in.");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password, rememberMe });
        login(res.data.data.accessToken, rememberMe);
        navigate("/applications"); 
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong");
      }
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

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

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