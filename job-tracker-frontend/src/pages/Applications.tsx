import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  SearchCheck,
  Ghost,
  Pencil,
  Trash2,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Plus,
} from "lucide-react";
import AutocompleteInput from "../components/AutocompleteInput";

type Application = {
  id: string;
  company: string;
  position: string;
  platform: string;
  status: string;
  appliedDate: string;
};

type FormState = {
  company: string;
  position: string;
  platform: string;
  status: string;
  appliedDate: string;
};

const today = new Date().toISOString().split("T")[0];

const initialForm: FormState = {
  company: "",
  position: "",
  platform: "",
  status: "Applied",
  appliedDate: today,
};

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const editingIdRef = useRef<string | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
    platform: "",
  });

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

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

      closeModal();
      loadApps();
    } catch {
      alert("Error saving application");
    }
}

  async function handleDelete(id: string) {
      setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    await api.delete(`/applications/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDeleteId(null);
    loadApps();
  }

  function handleEdit(app: Application) {
    setEditing(app);

    setForm({
      company: app.company,
      position: app.position,
      platform: app.platform,
      status: app.status,
      appliedDate: app.appliedDate
        ? String(app.appliedDate).slice(0, 10)
        : "",
    });

    setShowModal(true);
  }

  function openCreateModal() {
  setForm(initialForm);
  setShowModal(true);
}

  function closeModal() {
  setShowModal(false);
  setEditing(null);
  setForm(initialForm);
}

  const sortedApps = [...apps].sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime();
    const dateB = new Date(b.appliedDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredApps = sortedApps.filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch =
      app.company.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      app.platform.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q);

    return (
      matchesSearch &&
      app.company.toLowerCase().includes(filters.company.toLowerCase()) &&
      app.position.toLowerCase().includes(filters.position.toLowerCase()) &&
      app.platform.toLowerCase().includes(filters.platform.toLowerCase()) &&
      (filters.status === "" || app.status === filters.status)
    );
  });

  function getStageIndex(status: string) {
    const stages = ["Applied", "Interview", "References", "Offer"];
    return stages.indexOf(status);
  }

  const companySuggestions = [...new Set(apps.map((a) => a.company).filter(Boolean))];
  const positionSuggestions = [...new Set(apps.map((a) => a.position).filter(Boolean))];
  const platformSuggestions = [...new Set(apps.map((a) => a.platform).filter(Boolean))];

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
    <PageShell title="My Applications">
      <div className="center-page">
        <section className="single-column-card applications-shell">
          <div className="card-header-vertical">
            <h2 className="section-title center">My Applications</h2>
          </div>

          <div className="top-bar premium-top-bar">
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
              type="button"
              className="ghost-button toolbar-button"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>

            <button
              type="button"
              className="ghost-button toolbar-button"
              onClick={() => setShowSort((v) => !v)}
            >
              <ArrowUpDown size={15} />
              Sort
            </button>

            <div style={{ flex: 1 }} />

            <div className="status-legend">
              <span>🟡 Applied</span>
              <span>🟢 Interview</span>
              <span>🟣 References</span>
              <span>🔵 Offer</span>
              <span>🔴 Rejected</span>
              <span>⚫ Ghosted</span>
            </div>

            <button
              type="button"
              className="primary-button small toolbar-primary"
              onClick={openCreateModal}
            >
              <Plus size={16} />
              Add Application
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                className="filters-panel"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <input
                  placeholder="Company"
                  value={filters.company}
                  onChange={(e) =>
                    setFilters({ ...filters, company: e.target.value })
                  }
                />

                <input
                  placeholder="Position"
                  value={filters.position}
                  onChange={(e) =>
                    setFilters({ ...filters, position: e.target.value })
                  }
                />

                <input
                  placeholder="Platform"
                  value={filters.platform}
                  onChange={(e) =>
                    setFilters({ ...filters, platform: e.target.value })
                  }
                />

                <select
                  value={filters.status}
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
                  <option>Ghosted</option>
                </select>

              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {showSort && (
              <motion.div
                className="sort-panel"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="table-wrapper">
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
                      <p>No applications yet.</p>
                      <button
                        type="button"
                        className="primary-button small"
                        onClick={openCreateModal}
                      >
                        Add your first application
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>
                        <div>{app.company}</div>
                        <div className="timeline">
                          {["Applied", "Interview", "References", "Offer"].map((stage, i) => (
                            <div
                              key={stage}
                              className={`dot ${i <= getStageIndex(app.status) ? "active" : ""}`}
                            />
                          ))}
                        </div>
                      </td>

                      <td>{app.position}</td>
                      <td>{app.platform}</td>

                      <td>
                        <motion.span
                          className={`status-badge ${app.status.toLowerCase()}`}
                          whileHover={
                            app.status === "Ghosted"
                              ? { opacity: 0.6 }
                              : { scale: 1.05 }
                          }
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {getStatusIcon(app.status)}
                          <span style={{ marginLeft: 6 }}>{app.status}</span>
                        </motion.span>
                      </td>

                      <td className="date-cell">
                        {app.appliedDate.slice(0,10)}
                      </td>

                      <td className="actions">
                        <button
                          type="button"
                          className="secondary-button icon-button"
                          onClick={() => handleEdit(app)}
                        >
                          <Pencil size={14} />
                          Edit
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
          {showModal && (
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
                <div className="modal-title-row">
                  <h3>{editing ? "Edit Application" : "New Application"}</h3>
                </div>

                <AutocompleteInput
                  placeholder="Company"
                  value={form.company}
                  onChange={(value) => setForm({ ...form, company: value })}
                  suggestions={companySuggestions}
                />

                <AutocompleteInput
                  placeholder="Position"
                  value={form.position}
                  onChange={(value) => setForm({ ...form, position: value })}
                  suggestions={positionSuggestions}
                />

                <AutocompleteInput
                  placeholder="Platform"
                  value={form.platform}
                  onChange={(value) => setForm({ ...form, platform: value })}
                  suggestions={platformSuggestions}
                />

                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                  <option>References</option>
                  <option>Ghosted</option>
                </select>

                <label className="input-group">
                  <span>Application Date</span>
                  <input
                    type="date"
                    value={form.appliedDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, appliedDate: e.target.value })
                    }
                  />
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
