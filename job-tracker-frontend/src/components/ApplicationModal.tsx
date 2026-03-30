import { useEffect, useState } from "react";
import { ApplicationItem, ApplicationStatus } from "../types";

const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
  "In Review",
];

export default function ApplicationModal({
  open,
  initialValue,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialValue?: ApplicationItem | null;
  onClose: () => void;
  onSubmit: (payload: {
    company: string;
    jobTitle: string;
    platform: string;
    status: ApplicationStatus;
    appliedAt: string;
  }) => Promise<void>;
}) {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [appliedAt, setAppliedAt] = useState("");

  useEffect(() => {
    if (initialValue) {
      setCompany(initialValue.company);
      setJobTitle(initialValue.jobTitle);
      setPlatform(initialValue.platform);
      setStatus(initialValue.status);
      setAppliedAt(initialValue.appliedAt.slice(0, 10));
    } else {
      setCompany("");
      setJobTitle("");
      setPlatform("");
      setStatus("Applied");
      setAppliedAt(new Date().toISOString().slice(0, 10));
    }
  }, [initialValue, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      company,
      jobTitle,
      platform,
      status,
      appliedAt,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initialValue ? "Edit Application" : "Add New Application"}</h3>
          <button className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            Company
            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
          </label>

          <label>
            Position
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
          </label>

          <label>
            Platform
            <input value={platform} onChange={(e) => setPlatform(e.target.value)} required />
          </label>

          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
              {statusOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Applied Date
            <input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              required
            />
          </label>

          <div className="row-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {initialValue ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
