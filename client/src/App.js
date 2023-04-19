import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Profile from "./components/profile/Profile";
import MyTweets from "./components/personalPage/MyTweets";
import UserPage from "./components/personalPage/UserPage";
import SearchResult from "./components/search/SearchResult";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="main">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mytweets" element={<MyTweets />} />
            <Route path="/users/:username" element={<UserPage />} />
            <Route path="/searchresult" element={<SearchResult />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
