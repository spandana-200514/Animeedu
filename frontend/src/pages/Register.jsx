import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api.js";
import Loader from "../components/Loader.jsx";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    education_level: "Undergraduate",
    institution: "",
    department: "Computer Science",
    semester: "3",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        ...form,
        college_or_school: form.institution,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="logo-mark large">AE</span>
        <h1>Join AnimeEdu</h1>
        <p>School to engineering — one AI learning studio for lessons, animation, quizzes, and reports.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>Create student account</h2>
        {error ? <div className="alert error">{error}</div> : null}
        <label>
          Full name
          <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={form.confirm_password}
            onChange={(e) => update("confirm_password", e.target.value)}
            required
          />
        </label>
        <label>
          Education level
          <select value={form.education_level} onChange={(e) => update("education_level", e.target.value)}>
            <option>School</option>
            <option>PUC / High School</option>
            <option>Diploma</option>
            <option>Undergraduate</option>
            <option>Engineering</option>
            <option>Postgraduate</option>
          </select>
        </label>
        <label>
          College or school name
          <input value={form.institution} onChange={(e) => update("institution", e.target.value)} required />
        </label>
        <label>
          Department
          <input value={form.department} onChange={(e) => update("department", e.target.value)} />
        </label>
        <label>
          Semester
          <input value={form.semester} onChange={(e) => update("semester", e.target.value)} />
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
        {loading ? <Loader label="Saving your profile..." /> : null}
      </form>
    </div>
  );
}

export default Register;
