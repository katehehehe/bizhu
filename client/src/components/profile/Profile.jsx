import React, { useState, useEffect, useContext } from "react";
import "../../styles/profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [isLoggedin, setIsLoggedin] = useState(true);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newBio, setNewBio] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/isLoggedIn",
          {
            withCredentials: true,
          }
        );
        if (response.data.username) {
          console.log("check the response ", response.data);
          setUsername(response.data.username);
          setUserId(response.data.userId);
          setIsLoggedin(true);
        } else {
          setIsLoggedin(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkIsLoggedIn();
  }, []);

  useEffect(() => {
    if (username !== "") {
      fetchUserData();
    }
  }, [username]);

  console.log("---this is the username", username);
  console.log("---this is the userid", userId);

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData();
      if (newUsername !== "") {
        formData.append("username", newUsername);
      }

      if (newPassword !== "") {
        formData.append("password", newPassword);
      }

      if (newAvatar !== "") {
        formData.append("avatar", newAvatar);
      }
      if (newBio !== "") {
        formData.append("bio", newBio);
      }
      const response = await axios.put(
        `http://localhost:1337/api/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);

      setUsername(response.data.username);
      setPassword(response.data.password);
      setBio(response.data.bio);
      // setNewUsername(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log("this is the username", username);
      const response = await axios.get(
        `http://localhost:1337/api/users/${username}`
      );
      console.log("get the user data", response);

      const password = response.data.user.password;
      const avatar = response.data.user.avatar;
      const bio = response.data.user.bio;

      setPassword(password);
      setAvatar(avatar);
      setBio(bio);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
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
      <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>

      <div className="form-group">
        <label htmlFor="avatar">Avatar:</label>
        {avatar && <img src={avatar} alt="User avatar" className="avatar" />}
        {!avatar && <img src={avatar} alt="User avatar" className="avatar" />}
      </div>
      <form onSubmit={handleSubmit} className="center">
        <div className="form-group flex flex-row">
          <label htmlFor="name">Username:</label>
          <div className="profile-value">{username}</div>
        </div>
        <input
          className="fixed-width"
          type="text"
          id="name"
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <div className="form-group flex flex-row">
          <label htmlFor="password">Password:</label>
        </div>
        <input
          className="fixed-width"
          type="password"
          id="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="form-group flex flex-row">
          <label htmlFor="bio">Bio:</label>
          <div className="profile-value">{bio}</div>
        </div>
        {/* <input
          className="fixed-bio-width"
          type="bio"
          id="bio"
          onChange={(e) => setNewBio(e.target.value)}
        /> */}
        <textarea
          className="fixed-bio-width"
          id="bio"
          onChange={(e) => setNewBio(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="profile-form-button bg-twitterBlue content-center fixed-width"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;
