import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/loginRegister.css";
import axios from "axios";

function Register({ onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function registerUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:1337/api/register",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      await console.log(response.data);
      if (response.data.status === "ok") {
        onClose();
        setShowPopup(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={`overlay ${showPopup ? "" : "hidden"}`}>
      <div className="modal">
        <form className="signin-form" onSubmit={registerUser}>
          <label className="form-label">
            Username:
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <label className="form-label">
            Email:
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </label>
          <label className="form-label">
            Password:
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          <button className="form-button bg-twitterBlue" type="submit">
            Register
          </button>

          <button
            className="form-button bg-twitterBlue bottom-button"
            onClick={onClose}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
