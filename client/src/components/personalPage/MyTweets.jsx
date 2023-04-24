import React, { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "../feed/Tweet";
import { useParams } from "react-router-dom";
import "../../styles/userPage.css";

function MyTweets() {
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const response = await axios.get("/api/isLoggedIn", {
          withCredentials: true,
        });
        if (response.data.username) {
          setCurrentUser(response.data.username);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkIsLoggedIn();
  }, []);
  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await axios.get(`/api/user/posts/${username}`);
      const userPosts = response.data;
      setPosts(userPosts.reverse());
    };
    if (username) {
      fetchUserPosts();
    }
  }, [username]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/tweets/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (postId, updatedContent) => {
    if (!updatedContent || updatedContent.trim() === "") {
      console.log("invalid content");
      return;
    }
    try {
      const response = await axios.put(
        `/api/tweets/${postId}`,
        {
          content: updatedContent,
        },
        {
          withCredentials: true,
        }
      );
      // find the updated post in the posts array and update the content
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, content: updatedContent } : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mytweets-wrapper">
      <div className="">
        {posts.map((post) => (
          <Tweet
            key={post._id}
            tweet={post}
            canDelete={currentUser === post.username}
            handleDelete={() => handleDelete(post._id)}
            handleUpdate={(postId, updatedContent) =>
              handleUpdatePost(post._id, updatedContent)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default MyTweets;
