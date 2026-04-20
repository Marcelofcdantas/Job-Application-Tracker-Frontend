import { useState } from "react";
import PageShell from "../components/PageShell";

type Tab =
  | "profile"
  | "security"
  | "notifications"
  | "appearance";

interface UserUpdates {
  name?: string;
  email?: string;
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>("profile");

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [perApplication, setPerApplication] = useState(true);
  const [emailError, setEmailError] = useState("");

  const handleSavePreferences = async () => {
    const updates: UserUpdates = {};

    const currentEmail = localStorage.getItem('userEmail');

    if (name && name.trim() !== "") {
      updates.name = name;
    }

    if (newEmail && newEmail.trim() !== "") {
      if (newEmail !== currentEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(newEmail)) {
          setEmailError("Please enter a valid email address.");
          
          setTimeout(() => {
            setEmailError("");
          }, 10000);
          
          return;
        }
        
        updates.email = newEmail;
      }
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    try {
      console.log("Saving updates:", updates);
      // await api.patch('/user/update', updates);
      alert("Changes saved successfully!");
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  return (
    <PageShell title="Settings">
    
    <div className="settings-container responsive-settings">

      <div className="settings-sidebar responsive-sidebar">

        <button onClick={() => setTab("profile")}>Profile</button>
        <button onClick={() => setTab("security")}>Security</button>
        <button onClick={() => setTab("notifications")}>Notifications</button>
        <button onClick={() => setTab("appearance")}>Appearance</button>
      </div>

      <div className="settings-content responsive-content">

        {tab === "profile" && (
          <>
            <h2>Profile</h2>

            <label>Name / Nickname</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name or nickname"
            />

            <label>Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {emailError && (
              <p style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>
                {emailError}
              </p>
            )}

            <button className="primary-button" onClick={handleSavePreferences}>
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
              <button className= "btn-light-theme" onClick={() => setTheme("light")}>Light</button>
              <button className= "btn-dark-theme" onClick={() => setTheme("dark")}>Dark</button>
              <button className= "btn-system-theme" onClick={() => setTheme("system")}>System</button>
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