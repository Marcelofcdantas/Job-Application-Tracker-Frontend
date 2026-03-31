import { useState } from "react";
import api from "../services/api";
import PageShell from "../components/PageShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      if (!email.includes("@")) {
        setMessage("Please enter a valid email");
        return;
      }
      await api.post("/auth/reset/request", { email });
      setMessage("Check your email for reset instructions.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  }

  return (
    <PageShell title="Forgot Password">
      <div className="center-page">
        <section className="single-column-card forgot-card">
          <h2 className="hero-title">Forgot Password</h2>

          <p className="subtitle">
            Enter your email and we'll send you reset instructions.
          </p>

          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              className="forgot-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="primary-button">
              Send
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