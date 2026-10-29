import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function Root() {
  const routedApp = (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  if (!googleClientId) {
    return routedApp;
  }
  return <GoogleOAuthProvider clientId={googleClientId}>{routedApp}</GoogleOAuthProvider>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
