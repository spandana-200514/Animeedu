import React, { useState } from "react";
import { analyzeCode } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function CodeAnalyzer() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("def greet(name):\n    return f\"Hello, {name}\"\n\nprint(greet(\"AnimeEdu\"))\n");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await analyzeCode({ language, code });
      setResult(data.data);
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
          <p className="eyebrow">Code Analyzer</p>
          <h1>Understand programs like a teaching assistant</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <section className="panel">
        <label>
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Python</option>
            <option>Java</option>
            <option>C</option>
            <option>C++</option>
            <option>JavaScript</option>
          </select>
        </label>
        <textarea className="code-editor" rows="14" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="primary-btn" type="button" onClick={run} disabled={loading}>
          Analyze
        </button>
      </section>
      {loading ? <Loader label="Reading your code..." /> : null}
      {result ? (
        <section className="panel">
          <h3>Explanation</h3>
          <p>{result.explanation}</p>
          <p>
            <strong>Complexity:</strong> {result.complexity}
          </p>
          <h4>Errors</h4>
          <ul>
            {(result.errors || []).length === 0 ? <li>No syntax errors detected.</li> : null}
            {(result.errors || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>Suggestions</h4>
          <ul>
            {(result.suggestions || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4>Line-by-line</h4>
          <div className="line-list">
            {(result.line_by_line || []).map((item) => (
              <p key={item.line}>
                <code>
                  {item.line}: {item.code}
                </code>
                <span> — {item.explanation}</span>
              </p>
            ))}
          </div>
          <h4>Improved code</h4>
          <pre className="code-block">{result.improved_code}</pre>
        </section>
      ) : null}
    </div>
  );
}

export default CodeAnalyzer;
