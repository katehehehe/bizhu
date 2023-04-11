import React, { useState, useEffect, useContext } from "react";
import Tweet from "./Tweet";
import axios from "axios";

function TweetList() {
  const [tweets, setTweets] = useState({ tweetPosts: [] });
  const [newTweet, setNewTweet] = useState(null);

  useEffect(() => {
    // fetch tweets from API
    const fetchTweets = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/tweets");
        const data = response.data;
        console.log("Fetched tweets:", data);
        setTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, [newTweet]); // re-fetch tweets when new tweet is added

  const tweetsArray = tweets.tweetPosts;
  return (
    <div className="feed">
      {Array.isArray(tweetsArray) &&
        tweetsArray
          .slice(0)
          .reverse()
          .map((tweet) => {
            return <Tweet key={tweet.id} tweet={tweet} />;
          })}
    </div>
  );
}

export default TweetList;
