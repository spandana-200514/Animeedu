import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLesson, uploadLearningFile } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function LearningStudio() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("Machine Learning");
  const [subject, setSubject] = useState("Artificial Intelligence");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [mode, setMode] = useState("Visual");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("topic", topic);
        formData.append("subject", subject);
        formData.append("difficulty", difficulty);
        formData.append("mode", mode);
        result = await uploadLearningFile(formData);
      } else {
        result = await createLesson({ topic, subject, difficulty, mode, content });
      }
      setLesson(result.data);
      localStorage.setItem("animeedu_lesson", JSON.stringify(result.data));
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
          <p className="eyebrow">Learning Studio</p>
          <h1>Turn any topic into a lesson</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <form className="panel form-grid" onSubmit={generate}>
        <label>
          Topic
          <input value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </label>
        <label>
          Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>Artificial Intelligence</option>
            <option>Machine Learning</option>
            <option>Computer Science</option>
            <option>Physics</option>
            <option>Mathematics</option>
            <option>Biology</option>
            <option>Electronics</option>
            <option>General</option>
          </select>
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Learning mode
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Visual</option>
            <option>Story</option>
            <option>Exam prep</option>
            <option>Engineering</option>
          </select>
        </label>
        <label className="full">
          Text or notes
          <textarea rows="6" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste notes, or leave blank to auto-generate." />
        </label>
        <label className="full">
          Upload PDF, image, or text file
          <input type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={(e) => setFile(e.target.files[0] || null)} />
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          Generate lesson
        </button>
      </form>
      {loading ? <Loader label="Analyzing content and writing your lesson..." /> : null}
      {lesson ? (
        <section className="panel lesson-result">
          <h3>{lesson.topic}</h3>
          <h4>Summary</h4>
          <p>{lesson.summary}</p>
          <h4>Important concepts</h4>
          <ul>
            {(lesson.concepts || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>Key points</h4>
          <ul>
            {(lesson.key_points || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>Examples</h4>
          <ul>
            {(lesson.examples || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>Simple explanation</h4>
          <p>{lesson.explanation}</p>
          <button className="primary-btn" type="button" onClick={() => navigate("/animation")}>
            Create Animated Lesson
          </button>
        </section>
      ) : null}
    </div>
  );
}

export default LearningStudio;
