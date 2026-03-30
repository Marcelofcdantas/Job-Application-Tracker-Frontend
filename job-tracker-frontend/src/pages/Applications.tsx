import { useEffect, useState } from "react";
import api from "../services/api";

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/applications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setApps(res.data))
    .catch(() => console.log("Error loading apps"));
  }, []);

  return (
    <div>
      <h1>My Applications</h1>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        apps.map((app: any) => (
          <div key={app.id}>
            {app.company} - {app.position}
          </div>
        ))
      )}
    </div>
  );
}