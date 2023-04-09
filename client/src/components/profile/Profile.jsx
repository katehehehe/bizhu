import React, { useState, useEffect } from "react";
import "../../styles/profile.css";
import axios from "axios";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      const username = localStorage.getItem("username");
      const response = await axios.get(`/api/users/${username}`);
      const userData = response.data;
      setUsername(userData.username);
      setEmail(userData.email);
      setBio(userData.bio);
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Save changes to the database
    const response = await axios.put(`/api/users/${username}`, {
      username,
      email,
      bio,
    });
    console.log(response.data);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="profile-form-button bg-twitterBlue content-center"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;
