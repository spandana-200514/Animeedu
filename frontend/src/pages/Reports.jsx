import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getReport } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getReport()
      .then((data) => {
        if (mounted) setReport(data.data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loader label="Building your analytics..." />;
  }

  if (!report) {
    return <div className="alert error">{error || "No report data yet."}</div>;
  }

  const bars = (report.score_trend || []).map((value, index) => ({ name: `Quiz ${index + 1}`, value }));
  const pie = [
    { name: "Lessons", value: report.lessons_completed || 1 },
    { name: "Videos", value: report.videos_watched || 1 },
    { name: "Quizzes", value: report.quiz_count || 1 },
  ];
  const colors = ["#2563eb", "#38bdf8", "#6366f1"];

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Reports</p>
          <h1>{report.student} learning analytics</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <div className="stat-grid">
        <article className="stat-card">
          <p>Lessons completed</p>
          <h2>{report.lessons_completed}</h2>
        </article>
        <article className="stat-card">
          <p>Videos watched</p>
          <h2>{report.videos_watched}</h2>
        </article>
        <article className="stat-card">
          <p>Quiz average</p>
          <h2>{report.quiz_average}%</h2>
        </article>
        <article className="stat-card">
          <p>Learning progress</p>
          <h2>{report.learning_progress}%</h2>
        </article>
      </div>
      <div className="split">
        <section className="panel">
          <h3>Quiz scores</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={bars}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel">
          <h3>Activity mix</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80}>
                  {pie.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="split">
        <section className="panel">
          <h3>Strong topics</h3>
          <ul>
            {(report.strong_topics || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h3>Weak topics</h3>
          <ul>
            {(report.weak_topics || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Recommended next steps</h3>
          <ul>
            {(report.recommended_next_steps || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Reports;
