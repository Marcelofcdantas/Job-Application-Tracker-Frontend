import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";


export default function Home() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);


  useEffect(() => {
    if (location.state?.verified) {
      setMessage("Email verified! You can now log in.");
    }
  }, [location.state]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password, rememberMe });

      login(res.data.data.accessToken, email, rememberMe);
      navigate("/applications");
    } catch (err) {
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
      <div className="premium-auth-layout mobile-safe">
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
              <div className="input-with-icon">
                <input
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="icon-right" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </label>

            {error && <div className="error-box">{error}</div>}
            {message && <div className="success-box">{message}</div>}

            <div className="remember-forgot">
              <label className="remember-row">
                <input
                  type="checkbox"
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
              {loading ? "Signing in..." : "Login"}
            </button>

            <button
              className="secondary-button premium-secondary-button"
              type="button"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
