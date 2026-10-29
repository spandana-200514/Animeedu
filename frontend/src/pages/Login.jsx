import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogin, loginUser, saveSession } from "../services/api.js";
import Loader from "../components/Loader.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      saveSession(result.token, result.user, remember);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const result = await googleLogin({
        email: decoded.email,
        name: decoded.name,
        credential: credentialResponse.credential,
      });
      saveSession(result.token, result.user, true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in is not available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="logo-mark large">AE</span>
        <h1>AnimeEdu</h1>
        <p>Learn difficult topics through AI-generated animated lessons, quizzes, and a personal tutor.</p>
      </div>
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue your animated learning path.</p>
        {error ? <div className="alert error">{error}</div> : null}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <div className="password-row">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="google-box">
          {googleClientId ? (
            <GoogleLogin onSuccess={handleGoogle} onError={() => setError("Google sign-in was cancelled.")} />
          ) : (
            <button type="button" className="secondary-btn" disabled>
              Google login unavailable (add VITE_GOOGLE_CLIENT_ID)
            </button>
          )}
        </div>
        <p>
          New student? <Link to="/register">Create an account</Link>
        </p>
        {loading ? <Loader label="Connecting to AnimeEdu..." /> : null}
      </form>
    </div>
  );
}

export default Login;
