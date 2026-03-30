
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    async function verify() {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setMessage("Invalid verification link");
        return;
      }

      try {
        await api.post("/auth/verify-email", { token });
        setMessage("Email verified successfully! You can now login.");
      } catch (err: any) {
        setMessage(err?.response?.data?.message || "Verification failed");
      }
    }

    verify();
  }, []);

  return (
    <PageShell title="Verify Email">
      <div className="center-page">
        <section className="single-column-card">
          <h2 className="hero-title">Email Verification</h2>
          <p className="feedback-message">{message}</p>
        </section>
      </div>
    </PageShell>
  );
}
