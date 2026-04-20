import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { Calendar, User, Cpu, Brain, CheckCircle } from "lucide-react";
import { CalendarModal } from '../components/CalendarModal';
import { motion, AnimatePresence } from "framer-motion";

const ALL_STAGES = [
  { id: "SCREENING", label: "Screening", icon: Cpu },
  { id: "RECRUITER_SCREEN", label: "Recruiter Screen", icon: User },
  { id: "TECHNICAL_TEST", label: "Technical Test", icon: Cpu },
  { id: "AI_INTERVIEW", label: "Interview (AI)", icon: Brain },
  { id: "TECHNICAL_INTERVIEW", label: "Interview (Technical)", icon: Cpu },
  { id: "MANAGER_INTERVIEW", label: "Interview (Manager)", icon: User },
  { id: "REFERENCE_CHECK", label: "Reference Check", icon: CheckCircle },
];


function buildTimeline(selectedStages: string[]) {
  return ["APPLIED", ...selectedStages, "OFFER"];
}

function formatStage(stage: string) {
  const map: Record<string, string> = {
    APPLIED: "Applied",
    OFFER: "Offer",
    SCREENING: "Screening",
    RECRUITER_SCREEN: "Recruiter Screen",
    TECHNICAL_TEST: "Technical Test",
    AI_INTERVIEW: "Interview (AI)",
    TECHNICAL_INTERVIEW: "Interview (Technical)",
    MANAGER_INTERVIEW: "Interview (Manager)",
    REFERENCE_CHECK: "Reference Check",
  };
  return map[stage];
}

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState<string>("APPLIED");
  const [history, setHistory] = useState<any[]>([]);
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [modalOpenId, setModalOpenId] = useState<string | null>(null);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  const interviewData = {
    id: id || "temp",
    companyName: form?.company || "Company",
    date: interviewDate ? new Date(interviewDate) : new Date(),
    type: 'online' as const,
  };

  useEffect(() => {
    if (!interviewDate) return;

    const iso = new Date(interviewDate).toISOString();

    setHistory(prev =>
      prev.map(entry =>
        entry.stage === currentStage && entry.date !== iso
          ? { ...entry, date: iso }
          : entry
      )
    );
  }, [interviewDate, currentStage]);

  async function load() {
    try {
      const res = await api.get(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
      setSelectedStages(res.data.stages || []);
      setCurrentStage(res.data.currentStage || "APPLIED");
      setHistory(res.data.history || []);
      if (res.data.interviewDate) {
        const date = new Date(res.data.interviewDate);
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);
        setInterviewDate(date.toISOString().slice(0, 16));
      }
    } catch {
      alert("Error loading application");
    }
  }

  async function handleSave() {
    try {
      const payload = {
        ...form,
        stages: selectedStages,
        currentStage,
        history,
        interviewDate: interviewDate
          ? new Date(interviewDate).toISOString()
          : null
      };

      await api.put(`/applications/${id}`, payload, {
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

  function toggleStage(stageId: string) {
    setSelectedStages(prev => {
      if (prev.includes(stageId)) {
        return prev.filter(s => s !== stageId);
      }
      return [...prev, stageId];
    });
  }

  function changeStage(stage: string) {
    setCurrentStage(stage);

    const isInterview =
      stage === "TECHNICAL_INTERVIEW" ||
      stage === "MANAGER_INTERVIEW";

    const dateToUse =
      isInterview && interviewDate
        ? new Date(interviewDate).toISOString()
        : new Date().toISOString();

    setHistory(prev => {
      const existingIndex = prev.findIndex(h => h.stage === stage);

      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1).map((entry, i) =>
          i === existingIndex
            ? { ...entry, date: dateToUse }
            : entry
        );
      }

      return [...prev, { stage, date: dateToUse }];
    });
  }

  const timeline = buildTimeline(selectedStages);
  const currentIndex = timeline.indexOf(currentStage);

  const isInterviewStage = currentStage === "TECHNICAL_INTERVIEW" || currentStage === "MANAGER_INTERVIEW";

  if (!form) return <PageShell title="Loading..." />;

  return (
    <PageShell title="Application Details">
      <div className="center-page">
        <div className="single-column-card" style={{ maxWidth: 750 }}>

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

          <div style={{ marginTop: 20 }}>
            <h3>Process Stages</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_STAGES.map(stage => {
                const active = selectedStages.includes(stage.id);
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    onClick={() => toggleStage(stage.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 20,
                      border: "1px solid #ccc",
                      background: active ? "#2563eb" : "#f3f4f6",
                      color: active ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: 12
                    }}
                  >
                    <Icon size={14} />
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <h3>Timeline</h3>

            <div style={{ position: "relative", marginTop: 30 }}>
              <div style={{
                position: "absolute",
                top: 10,
                left: 0,
                right: 0,
                height: 4,
                background: "#e5e7eb"
              }} />

              <div style={{
                position: "absolute",
                top: 10,
                left: 0,
                height: 4,
                width: `${(currentIndex / (timeline.length - 1)) * 100}%`,
                background: "#2563eb",
                transition: "width 0.4s ease"
              }} />

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative"
              }}>
                {timeline.map((stage, index) => {
                  const isCurrent = stage === currentStage;
                  const isCompleted = index < currentIndex;

                  return (
                    <div key={stage} style={{ textAlign: "center", flex: 1 }}>
                      <div
                        onClick={() => changeStage(stage)}
                        style={{
                          margin: "0 auto",
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: isCurrent ? "#2563eb" : isCompleted ? "#16a34a" : "#d1d5db",
                          cursor: "pointer"
                        }}
                      />
                      <div style={{ fontSize: 10, marginTop: 6 }}>
                        {formatStage(stage)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isInterviewStage && (
            <div style={{ marginTop: 20 }}>
              <label>Interview Date</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
          )}

          {isInterviewStage && interviewDate && (
          <button 
            type="button"
            className="primary-button"
            onClick={() => setModalOpenId("calendar-modal")}>
            Add to Calendar
          </button>
          )}
          
          <AnimatePresence>
          {modalOpenId === "calendar-modal" && (
            <CalendarModal 
              isOpen={true} 
              onClose={() => setModalOpenId(null)} 
              interview={interviewData} 
            />
          )}
          </AnimatePresence>

          <div style={{ marginTop: 30 }}>
            <h3>History</h3>
            <ul style={{ fontSize: 12 }}>
              {history.map((h, i) => (
                <li key={i}>
                  {formatStage(h.stage)} - {new Date(h.date).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>

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

          {saved && <div className="success-toast">Changes saved successfully</div>}

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
