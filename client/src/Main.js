import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const MainContext = createContext();

function Main() {
  const [isLoggedin, setIsLoggedin] = useState(
    localStorage.getItem("isLoggedin") === "true"
  );
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  // const [username, setUsername] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    const storedIsLoggedin = localStorage.getItem("isLoggedin");
    if (storedIsLoggedin) {
      setIsLoggedin(true);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const userString = localStorage.getItem("user"); // replace "user" with your key
    const getUser = JSON.parse(userString);
    const storedUsername = getUser.name;
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUserName = (name) => {
    setUsername(name);
    localStorage.setItem("username", name);
  };
  return (
    <div className="App">
      <MainContext.Provider
        value={{
          isLoggedin,
          setIsLoggedin,
          username,
          setUsername,
          user,
          setUser,
          updateUser,
          updateUserName,
        }}
      >
        <Navbar />
        <div className="main">
          <Sidebar className="sidebar" />
          <Feed className="feed" newPost={newPost} />
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default Main;
