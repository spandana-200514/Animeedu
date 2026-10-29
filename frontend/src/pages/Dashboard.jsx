import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { checkBackend, getReport, getStoredUser } from "../services/api.js";
import Loader from "../components/Loader.jsx";

const actions = [
  { label: "Start Learning", path: "/learning", text: "Turn any topic into a structured lesson." },
  { label: "Generate Animation", path: "/animation", text: "Pick a character and render a video." },
  { label: "Take Quiz", path: "/quiz", text: "Test yourself with AI-generated questions." },
  { label: "Ask AI Tutor", path: "/tutor", text: "Get simple explanations in your language." },
  { label: "Analyze Code", path: "/code", text: "Understand programs line by line." },
  { label: "View Roadmap", path: "/roadmap", text: "Build a personalized weekly plan." },
  { label: "View Reports", path: "/reports", text: "Track progress, strengths, and gaps." },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [report, setReport] = useState(null);
  const [backend, setBackend] = useState("checking");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        await checkBackend();
        if (mounted) setBackend("online");
        const data = await getReport();
        if (mounted) setReport(data.data);
      } catch (err) {
        if (mounted) {
          setBackend("offline");
          setError(err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loader label="Loading your learning dashboard..." />;
  }

  const stats = report || {
    lessons_completed: 0,
    quiz_average: 0,
    streak: user?.streak || 1,
    score_trend: [20, 30, 40],
    activities: [],
  };
  const chartData = (stats.score_trend || []).map((value, index) => ({ name: `Q${index + 1}`, value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1>Welcome back, {user?.full_name || "Learner"}</h1>
          <p className="muted">Keep your streak alive with one animated lesson today.</p>
        </div>
        <span className={`status-pill ${backend}`}>{backend === "online" ? "API online" : "API offline"}</span>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <div className="stat-grid">
        <article className="stat-card">
          <p>Learning progress</p>
          <h2>{stats.learning_progress || 0}%</h2>
        </article>
        <article className="stat-card">
          <p>Completed lessons</p>
          <h2>{stats.lessons_completed}</h2>
        </article>
        <article className="stat-card">
          <p>Quiz score</p>
          <h2>{stats.quiz_average}%</h2>
        </article>
        <article className="stat-card">
          <p>Learning streak</p>
          <h2>{stats.streak} days</h2>
        </article>
      </div>
      <div className="split">
        <section className="panel">
          <h3>Quiz trend</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel">
          <h3>Recent activity</h3>
          <ul className="activity-list">
            {(stats.activities || []).length === 0 ? <li>No activity yet. Generate your first lesson.</li> : null}
            {(stats.activities || []).map((item, index) => (
              <li key={index}>
                <strong>{item.type}</strong>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <h3 className="section-title">Quick actions</h3>
      <div className="card-grid">
        {actions.map((action) => (
          <button key={action.path} className="action-card" type="button" onClick={() => navigate(action.path)}>
            <h4>{action.label}</h4>
            <p>{action.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
