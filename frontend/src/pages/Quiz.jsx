import React, { useState } from "react";
import { answerQuiz, generateQuiz } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function Quiz() {
  const lesson = (() => {
    try {
      return JSON.parse(localStorage.getItem("animeedu_lesson") || "null");
    } catch (error) {
      return null;
    }
  })();
  const [topic, setTopic] = useState(lesson?.topic || "Machine Learning");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await generateQuiz({
        topic,
        difficulty: lesson?.difficulty || "Beginner",
        content: lesson?.summary || "",
        count: 5,
      });
      setQuestions(data.data.questions);
      setAnswers([]);
      setIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const choose = async (optionIndex) => {
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    setLoading(true);
    try {
      const data = await answerQuiz({ topic, answers: nextAnswers, questions });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const current = questions[index];

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Quiz</p>
          <h1>Check what you understood</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <section className="panel">
        <label>
          Topic
          <input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <button className="primary-btn" type="button" onClick={start} disabled={loading}>
          Generate quiz
        </button>
      </section>
      {loading ? <Loader label="Preparing questions..." /> : null}
      {current && !result ? (
        <section className="panel">
          <p className="muted">
            Question {index + 1} of {questions.length}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <h3>{current.question}</h3>
          <div className="option-list">
            {current.options.map((option, optionIndex) => (
              <button key={option} type="button" className="option-btn" onClick={() => choose(optionIndex)}>
                {option}
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {result ? (
        <section className="panel">
          <h3>Quiz complete</h3>
          <p>
            Score: {result.score}/{result.total} ({result.percentage}%)
          </p>
          <p>
            <strong>Strengths:</strong> {(result.strengths || []).join(", ")}
          </p>
          <p>
            <strong>Weak areas:</strong> {(result.weak_areas || []).join(", ")}
          </p>
          <p>
            <strong>AI recommendation:</strong> {result.recommendation}
          </p>
        </section>
      ) : null}
    </div>
  );
}

export default Quiz;
