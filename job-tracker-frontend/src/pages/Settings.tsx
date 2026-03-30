import { useState } from "react";
import PageShell from "../components/PageShell";
import PrivateRoute from "../components/PrivateRoute";
import api from "../services/api";

export default function Settings() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();

    if (newEmail !== confirmEmail) {
      setMessage("Email confirmation does not match.");
      return;
    }

    try {
      await api.put("/user/email", {
        newEmail,
        currentPassword: emailPassword,
      });
      setMessage("Email updated successfully.");
      setNewEmail("");
      setConfirmEmail("");
      setEmailPassword("");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not update email.");
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Password confirmation does not match.");
      return;
    }

    try {
      await api.put("/user/password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not update password.");
    }
  }

  return (
    <PrivateRoute>
      <PageShell title="Account Settings">
        <div className="center-page">
          <section className="single-column-card">
            <h2 className="section-top-title">Account Settings</h2>

            <form className="stack settings-block" onSubmit={handleUpdateEmail}>
              <h3 className="section-title">Change Email</h3>

              <label>
                New Email
                <input
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>

              <label>
                Confirm New Email
                <input
                  placeholder="Confirm New Email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </label>

              <label>
                Current Password
                <input
                  type="password"
                  placeholder="Current Password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />
              </label>

              <button className="primary-button" type="submit">
                Update Email
              </button>
            </form>

            <div className="divider" />

            <form className="stack settings-block" onSubmit={handleUpdatePassword}>
              <h3 className="section-title">Change Password</h3>

              <label>
                Current Password
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label>
                Confirm New Password
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button className="primary-button" type="submit">
                Update Password
              </button>
            </form>

            {message ? <p className="feedback-message">{message}</p> : null}
          </section>
        </div>
      </PageShell>
    </PrivateRoute>
  );
}
