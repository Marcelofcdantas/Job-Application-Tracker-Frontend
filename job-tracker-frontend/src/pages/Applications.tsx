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

  const [sortOrder, setSortOrder] = useState("desc");

  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
    platform: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const token = localStorage.getItem("token");

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;

    await api.delete(`/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadApps();
  }

  function handleEdit(app: Application) {
    setEditing(app);
    setForm(app);
    setShowModal(true);
  }

  const sortedApps = [...apps].sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime();
    const dateB = new Date(b.appliedDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredApps = sortedApps.filter((app) => {
    return (
      app.company.toLowerCase().includes(filters.company.toLowerCase()) &&
      app.position.toLowerCase().includes(filters.position.toLowerCase()) &&
      app.platform.toLowerCase().includes(filters.platform.toLowerCase()) &&
      (filters.status === "" || app.status === filters.status)
    );
  });

function getStatusIcon(status: string) {
  switch (status) {
    case "Applied": return "🟡";
    case "Interview": return "🟢";
    case "References": return "🔍";
    case "Offer": return "⭐";
    case "Rejected": return "❌";
    default: return "";
  }
}

  return (
    <PageShell title="My Applications">
      <div className="center-page">
        <section className="single-column-card">

          <div className="card-header-vertical">
            <h2 className="section-title center">My Applications</h2>
          </div>

          <div className="top-bar">
            <input
              className="search-input"
              placeholder="🔍 Search..."
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
            />

            <button
              className="ghost-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters ▾
            </button>

            <button
              className="ghost-button"
              onClick={() => setShowSort(!showSort)}
            >
              Sort ▾
            </button>

            <div style={{ flex: 1 }} />

            <button
              className="primary-button small"
              onClick={() => setShowModal(true)}
            >
              + Add Application
            </button>
          </div>

          <div className="status-legend">
            <span>🟡 Applied</span>
            <span>🟢 Interview</span>
            <span>🟣 References</span>
            <span>🔵 Offer</span>
            <span>🔴 Rejected</span>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <input
                placeholder="Company"
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
              />

              <input
                placeholder="Position"
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
              />

              <input
                placeholder="Platform"
                onChange={(e) =>
                  setFilters({ ...filters, platform: e.target.value })
                }
              />

              <select
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>References</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </div>
          )}

          {showSort && (
            <div className="sort-panel">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          )}

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
              ) : filteredApps.length === 0 ? (
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
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.company}</td>
                    <td>{app.position}</td>
                    <td>{app.platform}</td>

                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {getStatusIcon(app.status)} {app.status}
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
                <option>References</option>
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
