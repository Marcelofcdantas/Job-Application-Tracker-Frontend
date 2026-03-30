import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { setEmailForMfa, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"login" | "mfa">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/login", { email, password });
      setEmailForMfa(email);
      setStep("mfa");
      setMessage("We sent a verification code to your email.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyMfa(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/mfa/verify", {
        email,
        code: mfaCode,
      });

      login(response.data.data.accessToken, response.data.data.refreshToken);
      navigate("/applications");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Welcome">
      <div className="center-page">
        <section className="single-column-card">
          <h2 className="hero-title">Welcome to Job Tracker Application</h2>

          <p className="hero-subtitle">Track your job applications in one place!</p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">📋</div>
              <div>
                <h4>Organize Your Job Search</h4>
                <p>Manage and track all your applications in one clean workspace.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h4>Monitor Your Progress</h4>
                <p>See each application status and follow your process more clearly.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <div>
                <h4>Stay Updated</h4>
                <p>Keep notes, reminders, interviews, and changes organized in one place.</p>
              </div>
            </div>
          </div>

          <div className="divider" />

          {step === "login" ? (
            <form className="stack" onSubmit={handleLogin}>
              <h3 className="section-title">Login in Your Account</h3>

              <label>
                Email
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <div className="inline-links">
                <label className="remember-row">
                  <input type="checkbox" />
                  <span>Remember Me</span>
                </label>

                <Link className="link-button" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Login"}
              </button>

              <button
                className="secondary-button full-width"
                type="button"
                onClick={() => setMessage("Connect this button to your register endpoint when ready.")}
              >
                Create Account
              </button>
            </form>
          ) : (
            <form className="stack" onSubmit={handleVerifyMfa}>
              <h3 className="section-title">Verify Your Access</h3>

              <label>
                Verification Code
                <input
                  placeholder="Enter the 6-digit code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                />
              </label>

              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button className="secondary-button full-width" type="button" onClick={() => setStep("login")}>
                Back to login
              </button>
            </form>
          )}

          {message ? <p className="feedback-message">{message}</p> : null}
        </section>
      </div>
    </PageShell>
  );
}
