import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

type Application = {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  appliedDate: string;
};

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);

  const [form, setForm] = useState({
    company: "",
    position: "",
    platform: "",
    status: "Applied",
  });

  const token = localStorage.getItem("token");

  // 🔥 LOAD DATA
  async function loadApps() {
    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(res.data);
    } catch {
      console.log("Error loading applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApps();
  }, []);

  // 🔥 CREATE / UPDATE
  async function handleSubmit() {
    try {
      if (editing) {
        await api.put(`/applications/${editing.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/applications", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowModal(false);
      setEditing(null);
      setForm({
        company: "",
        position: "",
        platform: "",
        status: "Applied",
      });

      loadApps();
    } catch {
      alert("Error saving application");
    }
  }

  // 🔥 DELETE
  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;

    await api.delete(`/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadApps();
  }

  // 🔥 EDIT
  function handleEdit(app: Application) {
    setEditing(app);
    setForm(app);
    setShowModal(true);
  }

  return (
    <PageShell title="My Applications">
      <div className="center-page">
        <section className="single-column-card">

          <div className="card-header-vertical">
            <h2 className="section-title center">My Applications</h2>

            <div className="header-actions">
              <button
                className="primary-button small"
                onClick={() => setShowModal(true)}
              >
                + Add Application
              </button>
            </div>
          </div>

          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <p>No applications yet.</p>

                    <button
                      className="primary-button small"
                      onClick={() => setShowModal(true)}
                    >
                      Add your first application
                    </button>
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.company}</td>
                    <td>{app.position}</td>
                    <td>{app.platform}</td>

                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="date-cell">
                      {new Date(app.appliedDate).toLocaleDateString("en-CA")}
                    </td>

                    <td className="actions">
                      <button
                        className="secondary-button"
                        onClick={() => handleEdit(app)}
                      >
                        Edit
                      </button>

                      <button
                        className="danger-button"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">

              <h3>{editing ? "Edit Application" : "New Application"}</h3>

              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />

              <input
                placeholder="Position"
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value })
                }
              />

              <input
                placeholder="Platform"
                value={form.platform}
                onChange={(e) =>
                  setForm({ ...form, platform: e.target.value })
                }
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>

              <div className="modal-actions">
                <button
                  className="primary-button"
                  onClick={handleSubmit}
                >
                  Save
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}