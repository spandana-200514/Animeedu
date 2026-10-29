import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LearningStudio from "./pages/LearningStudio.jsx";
import AnimationStudio from "./pages/AnimationStudio.jsx";
import CharacterStudio from "./pages/CharacterStudio.jsx";
import AnimationPreview from "./pages/AnimationPreview.jsx";
import Quiz from "./pages/Quiz.jsx";
import AITutor from "./pages/AITutor.jsx";
import CodeAnalyzer from "./pages/CodeAnalyzer.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Reports from "./pages/Reports.jsx";
import { isAuthenticated } from "./services/api.js";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>AnimeEdu hit an unexpected error</h1>
          <p>Reload the page or return to login. Your data on the server is safe.</p>
          <a href="/login">Go to login</a>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<LearningStudio />} />
          <Route path="/animation" element={<AnimationStudio />} />
          <Route path="/character-studio" element={<CharacterStudio />} />
          <Route path="/animation-preview" element={<AnimationPreview />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/tutor" element={<AITutor />} />
          <Route path="/code" element={<CodeAnalyzer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
