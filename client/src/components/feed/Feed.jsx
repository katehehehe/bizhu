import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../Main";
import Tweet from "./Tweet";
import NewPostForm from "./NewPostForm";

function Feed() {
  const [tweets, setTweets] = useState({ tweetPosts: [] });
  const [newTweet, setNewTweet] = useState(null);
  const { isLoggedin } = useContext(MainContext);

  useEffect(() => {
    // fetch tweets from API
    const fetchTweets = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/tweets");
        const data = await response.json();
        console.log("Fetched tweets:", data);
        setTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, [newTweet]); // re-fetch tweets when new tweet is added

  const handleNewTweet = (tweet) => {
    setNewTweet(tweet);
  };

  console.log("Tweets:", tweets.tweetPosts);
  console.log("Is tweets an array?", Array.isArray(tweets.tweetPosts));

  const tweetsArray = tweets.tweetPosts;
  return (
    <div className="feed">
      {isLoggedin && <NewPostForm onNewPost={handleNewTweet} />}

      {/* {Array.isArray(tweetsArray) &&
        tweetsArray.reverse().map((tweet) => {
          console.log("this is one tweet" + tweet);
          return <Tweet key={tweet.id} tweet={tweet} />;
        })} */}
      {Array.isArray(tweetsArray) &&
        tweetsArray
          .slice(0)
          .reverse()
          .map((tweet) => {
            console.log("this is one tweet" + tweet);
            return <Tweet key={tweet.id} tweet={tweet} />;
          })}
    </div>
  );
}

export default Feed;
