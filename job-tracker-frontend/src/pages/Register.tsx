
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", { email, password });
      setMessage("Check your email to verify your account");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Error creating account");
    }
  }

  return (
    <PageShell title="Create Account">
      <div className="center-page">
        <section className="single-column-card">
          <h2 className="hero-title">Create Your Account</h2>

          <form className="stack" onSubmit={handleRegister}>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>

            <label>
              Confirm Password
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </label>

            <button className="primary-button">Create Account</button>
          </form>

          {message && <p className="feedback-message">{message}</p>}
        </section>
      </div>
    </PageShell>
  );
}
