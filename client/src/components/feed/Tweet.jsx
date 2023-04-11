import React, { useEffect, useState, useContext } from "react";
import { MainContext } from "../../Main";
import "../../styles/tweet.css";

function Tweet({ tweet }) {
  const { username, content, createdAt, image } = tweet;
  // const { username, setUsername } = useContext(MainContext);
  const [imageData, setImageData] = useState(null);
  const date = new Date(Date.parse(createdAt));
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  let timeAgo;
  if (diffMinutes < 60) {
    timeAgo = `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours}h ago`;
  }

  useEffect(() => {
    if (image && image.data) {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(image.data.data))
      );
      setImageData(`data:image/png;base64,${base64String}`);
    }
  }, [image]);

  return (
    <div className="tweet">
      <div className="header">
        <h2 className="username">{username}</h2>
        {timeAgo && <p className="time-ago text-gray-500">{timeAgo}</p>}
      </div>
      <p className="content text-gray-800">{content}</p>
      {imageData && <img src={imageData} alt="tweet" />}
    </div>
  );
}

export default Tweet;
