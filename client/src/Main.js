import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/Feed";
function Main() {
  return (
    <div className="App">
      <Navbar />
      <div className="main">
        <Sidebar className="sidebar" />
        <Feed className="feed" />

        {/* Pass down setAuthenticated as a prop */}
      </div>
    </div>
  );
}

export default Main;
