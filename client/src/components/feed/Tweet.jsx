// import React from "react";
// import "../../styles/tweet.css";

// function Tweet({ tweet }) {
//   const { username, content, createdAt } = tweet;
//   const date = new Date(Date.parse(createdAt));
//   return (
//     <div className="tweet">
//       <h2>{username}</h2>
//       <p className="date text-gray-500">{date.toLocaleString()}</p>
//       <p className="text-gray-900">{content}</p>
//     </div>
//   );
// }

// export default Tweet;
import React from "react";
import "../../styles/tweet.css";

function Tweet({ tweet }) {
  const { username, content, createdAt } = tweet;
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
  return (
    <div className="tweet">
      <h2>{username}</h2>
      {timeAgo && <p className="date text-gray-500">{timeAgo}</p>}
      <p className="text-gray-800">{content}</p>
    </div>
  );
}

export default Tweet;
