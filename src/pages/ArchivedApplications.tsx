import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  SearchCheck,
  Ghost,
  Trash2,
  ArrowUpDown,
  Search,
  Plus,
} from "lucide-react";

type Application = {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  appliedDate: string;
};

export default function ArchivedApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  async function loadApps() {
    try {
      const res = await api.get("/applications/archived", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.log("Error loading applications");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
  }

  useEffect(() => {
    loadApps();
  }, []);

  async function handleRestore(id: string) {
    await api.post(`/applications/${id}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadApps();
  }

  async function confirmDelete() {
    if (!deleteId) return;

    await api.delete(`/applications/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDeleteId(null);
    loadApps();
  }

  const sortedApps = [...apps].sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime();
    const dateB = new Date(b.appliedDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredApps = sortedApps.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      app.platform.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  function getStatusIcon(status: string) {
    switch (status) {
      case "Applied":
        return <Clock size={14} />;
      case "Interview":
        return <SearchCheck size={14} />;
      case "References":
        return <CheckCircle size={14} />;
      case "Offer":
        return <Briefcase size={14} />;
      case "Rejected":
        return <XCircle size={14} />;
      case "Ghosted":
        return <Ghost size={14} />;
      default:
        return null;
    }
  }

  return (
    <PageShell title="Archived Applications">
      <div className="center-page">
        <section className="single-column-card applications-shell">

          <h2 className="section-title center">Archived Applications</h2>

          <div className="top-bar premium-top-bar responsive-top-bar">

            <div className="search-wrap">
              <Search size={16} />
              <input
                className="search-input premium-search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="ghost-button toolbar-button"
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              <ArrowUpDown size={15} />
              Sort
            </button>

          </div>

          <div className="table-wrapper responsive-table">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Date Applied</th>
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
                      No archived applications
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <td>{app.company}</td>
                      <td>{app.position}</td>
                      <td>{app.platform}</td>

                      <td>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {getStatusIcon(app.status)}
                          <span style={{ marginLeft: 6 }}>{app.status}</span>
                        </span>
                      </td>

                      <td>{app.appliedDate.slice(0, 10)}</td>

                      <td className="actions">
                        <button
                          className="primary-button small"
                          onClick={() => handleRestore(app.id)}
                        >
                          Restore
                        </button>

                        <button
                          type="button"
                          className="danger-button icon-button"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>

                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </section>

        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="modal"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <h3 style={{ marginBottom: 10 }}>Delete Application</h3>

                <p style={{ opacity: 0.7, marginBottom: 20 }}>
                  Are you sure you want to delete this application?
                </p>

                <div className="modal-actions">
                  <button
                    className="danger-button"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}