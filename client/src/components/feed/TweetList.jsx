import React, { useState, useEffect, useMemo } from "react";
import Tweet from "./Tweet";
import axios from "axios";

function TweetList() {
  const [tweets, setTweets] = useState({ tweetPosts: [] });
  const [newTweet, setNewTweet] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    // fetch users from API
    const fetchUsers = async () => {
      try {
        console.log("start to fetch users");
        const response = await axios.get("/api/users");
        const data = response.data;

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // fetch tweets from API
    const fetchTweets = async () => {
      try {
        const response = await axios.get("/api/tweets");
        const data = response.data;

        setTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchUsers();
    fetchTweets();
  }, [newTweet]); // re-fetch tweets when new tweet is added

  const tweetsArray = useMemo(() => {
    return Array.isArray(tweets.tweetPosts)
      ? tweets.tweetPosts.slice(0).reverse()
      : [];
  }, [tweets]);

  const usersArray = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  return (
    <div className="feed">
      {tweetsArray.map((tweet) => {
        const user = usersArray.find(
          (user) => user.username === tweet.username
        );

        return <Tweet key={tweet.id} tweet={tweet} user={user} />;
      })}
    </div>
  );
}

export default TweetList;
