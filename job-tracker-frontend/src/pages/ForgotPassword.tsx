import { useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

type Mode = "link" | "temp";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<Mode>("link");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/reset/request", { email, mode });
      setMessage(
        response.data?.message ||
          "If the email exists, instructions were sent."
      );
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Forgot Password">
      <div className="center-page">
        <section className="single-column-card">
          <h2 className="hero-title">Reset Your Access</h2>
          <p className="hero-subtitle">
            Enter your email and choose whether you want a reset link or a temporary password.
          </p>

          <form className="stack" onSubmit={handleSubmit}>
            <label>
              Registered Email
              <input
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  checked={mode === "link"}
                  onChange={() => setMode("link")}
                />
                <span>Send reset link</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  checked={mode === "temp"}
                  onChange={() => setMode("temp")}
                />
                <span>Send temporary password</span>
              </label>
            </div>

            <button className="primary-button" disabled={loading} type="submit">
              {loading ? "Sending..." : "Send Recovery Option"}
            </button>
          </form>

          {message ? <p className="feedback-message">{message}</p> : null}
        </section>
      </div>
    </PageShell>
  );
}
