import { useState } from "react";
import PageShell from "../components/PageShell";

type Tab =
  | "profile"
  | "security"
  | "notifications"
  | "appearance";

export default function Settings() {
  const [tab, setTab] = useState<Tab>("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [perApplication, setPerApplication] = useState(true);

  return (
    <PageShell title="Settings">
    
    <div className="settings-container">

      <div className="settings-sidebar">

        <button onClick={() => setTab("profile")}>Profile</button>
        <button onClick={() => setTab("security")}>Security</button>
        <button onClick={() => setTab("notifications")}>Notifications</button>
        <button onClick={() => setTab("appearance")}>Appearance</button>
      </div>

      <div className="settings-content">

        {tab === "profile" && (
          <>
            <h2>Profile</h2>

            <label>Name / Nickname</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="primary-button">
              Save changes
            </button>
          </>
        )}

        {tab === "security" && (
          <>
            <h2>Security</h2>

            <label>Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="primary-button">
              Update password
            </button>
          </>
        )}

        {tab === "notifications" && (
          <>
            <h2>Notifications</h2>

            <div className="toggle-row">
              <span>Enable follow-up alerts</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() =>
                  setNotificationsEnabled(!notificationsEnabled)
                }
              />
            </div>

            {notificationsEnabled && (
              <>
                <label>Notify me:</label>

                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={perApplication}
                      onChange={() => setPerApplication(true)}
                    />
                    Per application
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={!perApplication}
                      onChange={() => setPerApplication(false)}
                    />
                    Summary
                  </label>
                </div>

                {!perApplication && (
                  <>
                    <label>Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="7">Every 7 days</option>
                      <option value="15">Every 15 days</option>
                      <option value="30">Every 30 days</option>
                    </select>
                  </>
                )}
              </>
            )}

            <button className="primary-button">
              Save preferences
            </button>
          </>
        )}

        {tab === "appearance" && (
          <>
            <h2>Appearance</h2>

            <label>Theme</label>
            <div className="theme-switch">
              <button onClick={() => setTheme("light")}>Light</button>
              <button onClick={() => setTheme("dark")}>Dark</button>
              <button onClick={() => setTheme("system")}>System</button>
            </div>

            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Espanol</option>
              <option value="fr">French</option>
            </select>

            <button className="primary-button">
              Save preferences
            </button>
          </>
        )}

      </div>
    </div>
    </PageShell>
  );
}