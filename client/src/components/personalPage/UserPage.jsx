import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/userPage.css";
import MyTweets from "./MyTweets";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function UserPage() {
  const { username } = useParams();
  const [currentUsername, setCurrentUsername] = useState("");
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [joinedAt, setJoinedAt] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const response = await axios.get("/api/isLoggedIn", {
          withCredentials: true,
        });
        if (response.data.username) {
          setIsLoggedin(true);
          setCurrentUsername(response.data.username);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkIsLoggedIn();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    if (user) {
      setJoinedAt(user.user.joinedAt);
      setBio(user.user.bio);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }
  const date = new Date(joinedAt);
  const formattedDate = date.toLocaleString();

  return (
    <div className="user-page-container mx-10">
      <div className="profile-button-wrapper">
        <button
          className="text-twitterBlue hover:text-blue-800 text-lg"
          onClick={() => navigate(-1)}
        >
          &lt; Back
        </button>
        <div className="button-space"></div>
        <button
          className="text-twitterBlue hover:text-blue-800 text-lg"
          onClick={() => navigate("/")}
        >
          &lt; Home
        </button>
      </div>
      <div className="user-header">
        <div className="user-avatar">
          <img src={user.user.avatar} alt="User Avatar" className="avatar" />
          <Link to="/profile" className="edit-icon-container">
            <div className="edit-icon-wrapper">
              {currentUsername === username && (
                <>
                  <EditIcon className="edit-icon" />
                  <span className="edit-icon-text">Edit Profile</span>
                </>
              )}
            </div>
          </Link>
        </div>
        <div className="user-info">
          <h1 className="user-name">{username}</h1>
          {user.user.bio ? (
            <p className="user-bio">{user.user.bio}</p>
          ) : (
            <p className="user-bio">I got nothing to say...</p>
          )}
        </div>
        {joinedAt && (
          <p className="text-gray-500 text-lg twitterBlue">
            <span className="font-bold">Joined at:</span> {formattedDate}
          </p>
        )}
      </div>

      <MyTweets />

      <div className="user-tweets">
        {user.user.tweets.map((tweet) => (
          <div className="tweet" key={tweet._id}>
            <p className="tweet-content">{tweet.content}</p>
            {tweet.image && (
              <img
                src={`data:${tweet.image.contentType};base64,${tweet.image.data}`}
                alt="Tweet Image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPage;
