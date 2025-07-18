// src/App.js
import React from "react";
import Board from "./components/Board";
import "./index.css";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Board />
    </div>
  );
}
