import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm(res.data);
    } catch {
      alert("Error loading application");
    }
  }

  async function handleSave() {
  try {
    await api.put(`/applications/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSaved(true);

    setTimeout(() => {
      navigate("/applications");
    }, 1000);

  } catch {
    alert("Error saving");
  }
}

  if (!form) return <PageShell title="Loading..." />;

  return (
    <PageShell title="Application Details">
      <div className="center-page">
        <div className="single-column-card" style={{ maxWidth: 600 }}>

          <h2>Application Details</h2>

          <label>Company</label>
          <input value={form.company} disabled />

          <label>Position</label>
          <input value={form.position} disabled />

          <label>Platform</label>
          <input value={form.platform} disabled />

          <label>Status</label>
          <input value={form.status} disabled />

          <label>Date Applied</label>
          <input value={form.appliedDate?.slice(0,10)} disabled />

          <hr />

          <label>Country</label>
          <input
            value={form.country || ""}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
          />

          <label>Province</label>
          <input
            value={form.province || ""}
            onChange={(e) =>
              setForm({ ...form, province: e.target.value })
            }
          />

          <label>City</label>
          <input
            value={form.city || ""}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />

          <label>Salary</label>
          <input
            value={form.salary || ""}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

          <label>Work Mode</label>
          <select
            value={form.workMode || ""}
            onChange={(e) =>
              setForm({ ...form, workMode: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>

          {saved && (
            <div className="success-toast">
                Changes saved successfully
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button className="primary-button" onClick={handleSave}>
              Save
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/applications")}
              style={{ marginLeft: 10 }}
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </PageShell>
  );
}