import React from "react";
import "../App.css";

const Loading = () => (
  <div className="loading-container">
    <span className="loading-text">
      Loading
      <span className="dot one">.</span>
      <span className="dot two">.</span>
      <span className="dot three">.</span>
    </span>
  </div>
);

export default Loading;