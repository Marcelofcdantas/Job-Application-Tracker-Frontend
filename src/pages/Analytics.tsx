import PageShell from "../components/PageShell";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell
} from "recharts";

const STAGE_COLORS: Record<string, string> = {
  SCREENING: "#93c5fd",
  RECRUITER_SCREEN: "#818cf8",
  TECHNICAL_TEST: "#34d399",
  AI_INTERVIEW: "#22c55e",
  TECHNICAL_INTERVIEW: "#f59e0b",
  MANAGER_INTERVIEW: "#fb923c",
  REFERENCE_CHECK: "#f87171",
  OFFER: "#84cc16",
};

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      alert("Error loading analytics");
    }
  }

  const total = data.length;

  const offers = data.filter(a => a.currentStage === "OFFER").length;

  const inProgress = data.filter(a => a.currentStage !== "OFFER").length;

  function formatStageLabel(stage: string) {
    return stage
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    }

  function calculateAverageTime(stage: string) {
    const times: number[] = [];

    data.forEach(app => {
      if (!app.history) return;

      for (let i = 1; i < app.history.length; i++) {
        if (app.history[i].stage === stage) {
          const prev = new Date(app.history[i - 1].date).getTime();
          const current = new Date(app.history[i].date).getTime();

          const diff = (current - prev) / (1000 * 60 * 60 * 24);
          times.push(diff);
        }
      }
    });

    if (!times.length) return 0;

    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  }

  function calculateAverageTotal() {
    const times: number[] = [];

    data.forEach(app => {
      if (!app.history || app.history.length < 2) return;

      const first = new Date(app.history[0].date).getTime();
      const last = new Date(app.history[app.history.length - 1].date).getTime();

      const diff = (last - first) / (1000 * 60 * 60 * 24);
      times.push(diff);
    });

    if (!times.length) return 0;

    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  }

  const byStage = data.reduce((acc: any, app) => {
    const stage = app.currentStage || "UNKNOWN";
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const stageChartData = Object.keys(byStage).map(stage => ({
    name: stage,
    value: byStage[stage]
  }));

  const funnelData = [
    { name: "Applied", value: total },
    {
      name: "Interview",
      value: data.filter(a => a.currentStage?.includes("INTERVIEW")).length
    },
    { name: "Offer", value: offers }
  ];

  const stages = [
    "SCREENING",
    "TECHNICAL_TEST",
    "TECHNICAL_INTERVIEW",
    "MANAGER_INTERVIEW"
  ];

  return (
    <PageShell title="Analytics">
      <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 20
        }}>
          <Card title="Total Applications" value={total} />
          <Card title="In Progress" value={inProgress} />
          <Card title="Offers" value={offers} />
          <Card title="Avg Time" value={`${calculateAverageTotal()}d`} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20
        }}>

          <ChartCard title="Applications by Stage">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stageChartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value">
                  {stageChartData.map((entry, index) => (
                    <Cell key={index} fill={STAGE_COLORS[entry.name] || "#888"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Average Time by Stage (days)">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                layout="vertical"
                data={stages.map(s => ({
                    name: s,
                    value: Number(calculateAverageTime(s))
                }))}
                margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
                >
                <XAxis type="number" stroke="#ccc" />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#ccc"
                    tick={{ fontSize: 14 }}
                    tickFormatter={formatStageLabel}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Funnel">
            <ResponsiveContainer width="100%" height={250}>
              <FunnelChart>
                <Funnel dataKey="value" data={funnelData}>
                  <LabelList position="right" fill="#fff" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly Evolution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: "Week 1", value: 50 },
                { name: "Week 2", value: 80 },
                { name: "Week 3", value: 60 },
                { name: "Week 4", value: 90 },
              ]}>
                <XAxis dataKey="name" stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

      </div>
    </PageShell>
  );
}


function Card({ title, value }: any) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 12,
      background: "#1f2937",
      color: "#fff"
    }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 12,
      background: "#111827",
      color: "#fff"
    }}>
      <h3 style={{ marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );
}