import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../Main";
import TweetList from "./TweetList";
import NewPostForm from "./NewPostForm";

function Feed() {
  const [tweets, setTweets] = useState({ tweetPosts: [] });
  const [newTweet, setNewTweet] = useState(null);
  const { isLoggedin } = useContext(MainContext);

  const handleNewTweet = (tweet) => {
    setNewTweet(tweet);
  };

  return (
    <div className="feed">
      {isLoggedin && <NewPostForm onNewPost={handleNewTweet} />}
      <TweetList />
    </div>
  );
}

export default Feed;
