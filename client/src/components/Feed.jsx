import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../Main";
import "../styles/feed.css";
import NewPostForm from "./NewPostForm";
import SearchTab from "./SearchTab";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { isLoggedin } = useContext(MainContext);

  return (
    <div className="feed">
      Home
      <SearchTab />
      {isLoggedin ? <NewPostForm /> : null}
    </div>
  );
}

export default Feed;
