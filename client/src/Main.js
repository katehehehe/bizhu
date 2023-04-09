import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/Feed";
export const MainContext = createContext();

function Main() {
  const [isLoggedin, setIsLoggedin] = useState(
    localStorage.getItem("isLoggedin") === "true"
  );
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedIsLoggedin = localStorage.getItem("isLoggedin");
    if (storedIsLoggedin) {
      setIsLoggedin(true);
    }
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUsername(storedUserName);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const updateUserName = (name) => {
    setUsername(name);
    localStorage.setItem("userName", name);
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
        }}
      >
        <Navbar />
        <div className="main">
          <Sidebar className="sidebar" />
          <Feed className="feed" />
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default Main;
