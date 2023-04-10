import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import axios from "axios";

export const MainContext = createContext();

function Main() {
  const [isLoggedin, setIsLoggedin] = useState(
    localStorage.getItem("isLoggedin") === "true"
  );
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    const storedIsLoggedin = localStorage.getItem("isLoggedin");
    const storedToken = localStorage.getItem("token");
    if (storedIsLoggedin && storedToken) {
      setIsLoggedin(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      axios.get("http://localhost:1337/api/me").then((response) => {
        setUser(response.data);
        setUsername(response.data.name);
        localStorage.setItem("userName", response.data.name); // Set userName in local storage
      });
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const updateUserName = (name) => {
    setUsername(name);
    localStorage.setItem("userName", name);
  };

  const handleSubmit = async (event, content) => {
    event.preventDefault();
    try {
      console.log("Submitting a new tweet...");
      const response = await axios.post("http://localhost:1337/api/tweet", {
        data: content,
      });
      console.log("Response received:", response);
      const data = response.data;
      console.log("New post created:", data);
      setNewPost(data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
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
          <Feed
            className="feed"
            newPost={newPost}
            handleSubmit={handleSubmit}
          />
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default Main;
