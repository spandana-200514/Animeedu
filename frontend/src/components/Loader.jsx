import React from "react";

function Loader({ label }) {
  return (
    <div className="loader-wrap" role="status">
      <div className="spinner" />
      <p>{label || "Loading..."}</p>
    </div>
  );
}

export default Loader;
