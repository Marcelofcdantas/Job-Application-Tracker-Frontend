import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import PrivateRoute from "../components/PrivateRoute";
import ApplicationModal from "../components/ApplicationModal";
import api from "../services/api";
import { ApplicationItem } from "../types";

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [searchCompany, setSearchCompany] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortByDate, setSortByDate] = useState<"desc" | "asc">("desc");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationItem | null>(null);

  async function loadApplications() {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return [...applications]
      .filter((item) =>
        item.company.toLowerCase().includes(searchCompany.toLowerCase())
      )
      .filter((item) => (filterStatus ? item.status === filterStatus : true))
      .sort((a, b) =>
        sortByDate === "desc"
          ? new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
          : new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      );
  }, [applications, searchCompany, filterStatus, sortByDate]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this application?")) return;

    try {
      await api.delete(`/applications/${id}`);
      setMessage("Application deleted.");
      loadApplications();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not delete application.");
    }
  }

  async function handleSubmit(payload: {
    company: string;
    jobTitle: string;
    platform: string;
    status: any;
    appliedAt: string;
  }) {
    try {
      if (editing) {
        await api.put(`/applications/${editing.id}`, payload);
        setMessage("Application updated.");
      } else {
        await api.post("/applications", payload);
        setMessage("Application created.");
      }
      setModalOpen(false);
      setEditing(null);
      loadApplications();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Could not save application.");
    }
  }

  return (
    <PrivateRoute>
      <PageShell title="My Applications">
        <div className="center-page">
          <section className="wide-card">
            <div className="section-header">
              <h2>My Applications</h2>
              <button
                className="primary-button compact-button"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Add Application
              </button>
            </div>

            <div className="filters-grid">
              <label>
                Search by company
                <input
                  placeholder="Google"
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                />
              </label>

              <label>
                Filter by status
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Ghosted">Ghosted</option>
                  <option value="In Review">In Review</option>
                </select>
              </label>

              <label>
                Sort by date
                <select
                  value={sortByDate}
                  onChange={(e) => setSortByDate(e.target.value as "desc" | "asc")}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>

            {loading ? (
              <p className="feedback-message">Loading applications...</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Platform</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.company}</td>
                        <td>{app.jobTitle}</td>
                        <td>{app.platform}</td>
                        <td>
                          <span className={`status-pill ${app.status.replaceAll(" ", "-").toLowerCase()}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="dark-button"
                              onClick={() => {
                                setEditing(app);
                                setModalOpen(true);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="danger-button"
                              onClick={() => handleDelete(app.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!filteredApplications.length ? (
                  <p className="feedback-message">No applications found.</p>
                ) : null}
              </div>
            )}

            {message ? <p className="feedback-message">{message}</p> : null}
          </section>
        </div>

        <ApplicationModal
          open={modalOpen}
          initialValue={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      </PageShell>
    </PrivateRoute>
  );
}
