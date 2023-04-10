import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../Main";
import TweetList from "./TweetList";
import NewPostForm from "./NewPostForm";
import axios from "axios";

function Feed() {
  const [tweets, setTweets] = useState({ tweetPosts: [] });
  const [newTweet, setNewTweet] = useState(null);
  const { isLoggedin } = useContext(MainContext);

  const handleNewTweet = (tweet) => {
    setNewTweet(tweet);
  };

  console.log("Tweets:", tweets.tweetPosts);
  console.log("Is tweets an array?", Array.isArray(tweets.tweetPosts));

  return (
    <div className="feed">
      {isLoggedin && <NewPostForm onNewPost={handleNewTweet} />}
      <TweetList />
    </div>
  );
}

export default Feed;
