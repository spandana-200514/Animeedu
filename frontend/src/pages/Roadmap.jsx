import React, { useState } from "react";
import { generateRoadmap, getStoredUser } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function Roadmap() {
  const user = getStoredUser() || {};
  const [form, setForm] = useState({
    education_level: user.education_level || "Undergraduate",
    department: user.department || "Computer Science",
    interests: "Artificial Intelligence",
    skills: "Python",
    weak_areas: "Mathematics",
    quiz_performance: 70,
  });
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generate = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await generateRoadmap(form);
      setRoadmap(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Personalized roadmap</p>
          <h1>A plan that matches your level</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <form className="panel form-grid" onSubmit={generate}>
        <label>
          Education level
          <input value={form.education_level} onChange={(e) => update("education_level", e.target.value)} />
        </label>
        <label>
          Department
          <input value={form.department} onChange={(e) => update("department", e.target.value)} />
        </label>
        <label>
          Interests
          <input value={form.interests} onChange={(e) => update("interests", e.target.value)} />
        </label>
        <label>
          Skills
          <input value={form.skills} onChange={(e) => update("skills", e.target.value)} />
        </label>
        <label>
          Weak areas
          <input value={form.weak_areas} onChange={(e) => update("weak_areas", e.target.value)} />
        </label>
        <label>
          Quiz performance
          <input
            type="number"
            value={form.quiz_performance}
            onChange={(e) => update("quiz_performance", Number(e.target.value))}
          />
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          Generate roadmap
        </button>
      </form>
      {loading ? <Loader label="Designing your learning path..." /> : null}
      {roadmap ? (
        <div>
          <h3 className="section-title">Weekly milestones</h3>
          <div className="timeline">
            {(roadmap.weekly || []).map((item) => (
              <article key={item.week} className="timeline-card">
                <span>Week {item.week}</span>
                <h4>{item.title}</h4>
                <p>{item.goal}</p>
              </article>
            ))}
          </div>
          <div className="split">
            <section className="panel">
              <h3>Daily plan</h3>
              <ul>
                {(roadmap.daily || []).map((item) => (
                  <li key={item.day}>
                    <strong>{item.day}:</strong> {item.focus}
                  </li>
                ))}
              </ul>
            </section>
            <section className="panel">
              <h3>Recommended topics</h3>
              <ul>
                {(roadmap.recommended_topics || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Projects</h3>
              <ul>
                {(roadmap.recommended_projects || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Skills to improve</h3>
              <ul>
                {(roadmap.skills_to_improve || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Roadmap;
