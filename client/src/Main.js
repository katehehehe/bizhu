import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import axios from "axios";
import Search from "./components/search/Search";

export const MainContext = createContext();

function Main() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState(null);
  const [newPost, setNewPost] = useState(null);

  const checkIsLoggedIn = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/isLoggedIn", {
        withCredentials: true,
      });
      console.log("response from main ", response);
      if (response.data.username) {
        setUsername(response.data.username);
        setIsLoggedin(true);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  console.log("isloggedin", isLoggedin);
  console.log("username", username);

  const updateUser = (userData) => {
    setUsername(userData.name);
  };

  const updateUserName = (name) => {
    setUsername(name);
  };

  return (
    <div className="App">
      <MainContext.Provider
        value={{
          isLoggedin,
          setIsLoggedin,
          username,
          setUsername,
          updateUser,
          updateUserName,
        }}
      >
        <Navbar />
        <div className="app-container">
          <div className="sidebar">{<Sidebar />}</div>
          <div className="main-component">
            <div className="feed-wrapper">
              <Feed newPost={newPost} />
            </div>
          </div>
          <div className="search-wrapper search-wrapper--mobile">
            <Search />
          </div>
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default Main;
