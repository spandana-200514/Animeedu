import React, { useState } from "react";
import { askTutor } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function AITutor() {
  const [topic, setTopic] = useState("Machine Learning");
  const [question, setQuestion] = useState("Explain neural networks simply");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    const userMessage = { role: "student", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError("");
    try {
      const data = await askTutor({ topic, question });
      setMessages((prev) => [...prev, { role: "ai", text: data.data.answer }]);
      setQuestion("");
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
          <p className="eyebrow">AI Tutor</p>
          <h1>Ask anything about your lesson</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <section className="panel chat-panel">
        <label>
          Topic
          <input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <div className="chat-log">
          {messages.length === 0 ? <p className="muted">Try: Explain this topic in Kannada.</p> : null}
          {messages.map((message, index) => (
            <div key={index} className={message.role === "student" ? "bubble student" : "bubble ai"}>
              {message.text}
            </div>
          ))}
          {loading ? <Loader label="Tutor is thinking..." /> : null}
        </div>
        <form className="chat-form" onSubmit={send}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question" />
          <button className="primary-btn" type="submit" disabled={loading}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default AITutor;
