import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 180000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("animeedu_token") || sessionStorage.getItem("animeedu_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrapError(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail) && detail[0]?.msg) {
    return detail[0].msg;
  }
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the AnimeEdu backend. Start it on http://localhost:8000.";
  }
  return fallback;
}

export function saveSession(token, user, remember) {
  localStorage.removeItem("animeedu_token");
  sessionStorage.removeItem("animeedu_token");
  const store = remember ? localStorage : sessionStorage;
  store.setItem("animeedu_token", token);
  localStorage.setItem("animeedu_user", JSON.stringify(user || {}));
}

export function clearSession() {
  localStorage.removeItem("animeedu_token");
  sessionStorage.removeItem("animeedu_token");
  localStorage.removeItem("animeedu_user");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("animeedu_user") || "null");
  } catch (error) {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("animeedu_token") || sessionStorage.getItem("animeedu_token"));
}

export const registerUser = async (data) => {
  try {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Registration failed."));
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Login failed."));
  }
};

export const googleLogin = async (data) => {
  try {
    const response = await api.post("/api/auth/google", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Google sign-in failed."));
  }
};

export const createLesson = async (data) => {
  try {
    const response = await api.post("/api/learning/lesson", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not generate the lesson."));
  }
};

export const uploadLearningFile = async (formData) => {
  try {
    const response = await api.post("/api/learning/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "File upload failed."));
  }
};

export const generateQuiz = async (data) => {
  try {
    const response = await api.post("/api/quiz/generate", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not generate the quiz."));
  }
};

export const answerQuiz = async (data) => {
  try {
    const response = await api.post("/api/quiz/answer", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not submit quiz answers."));
  }
};

export const askTutor = async (data) => {
  try {
    const response = await api.post("/api/tutor/ask", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "AI tutor is unavailable."));
  }
};

export const analyzeCode = async (data) => {
  try {
    const response = await api.post("/api/code/analyze", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Code analysis failed."));
  }
};

export const generateRoadmap = async (data) => {
  try {
    const response = await api.post("/api/roadmap/generate", data);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not generate the roadmap."));
  }
};

export const getReport = async () => {
  try {
    const response = await api.get("/api/reports/demo");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not load reports."));
  }
};

export const generateLessonAnimation = async (data) => {
  const response = await api.post("/api/animation/generate", data);
  return response.data;
};

export const checkBackend = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error, "Backend is offline."));
  }
};
