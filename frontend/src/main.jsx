import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ← loads Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="w-screen h-screen flex items-center justify-center">
      <App />
    </div>
  </React.StrictMode>
);
