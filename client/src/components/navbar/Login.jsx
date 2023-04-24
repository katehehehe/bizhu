import React, { useState, useContext } from "react";
import "../../styles/loginRegister.css";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../Main";

function Login({ onClose }) {
  const { setIsLoggedin, updateUser } = useContext(MainContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting login form...");
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      if (data.token) {
        updateUser(data);
        setUsername(data.name);
        setIsLoggedin(true);
        onClose();
      } else {
        displayErrorMessage(
          "Failed to log in. Please check your username and password."
        );
      }
    } catch (error) {
      console.error(error);
      displayErrorMessage(
        "Failed to log in. Please check your username and password."
      );
    }
  };

  const displayErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 3000); // 3 seconds
  };

  return (
    <div className="overlay">
      <div className="modal">
        <form
          className="signin-form"
          onSubmit={(e) => handleLogin(e, navigate)}
        >
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
            Password:
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          {errorMessage && (
            <div className="notification-wrapper">
              <p>{errorMessage}</p>
            </div>
          )}
          <button className="form-button bg-twitterBlue" type="submit">
            Log In
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

export default Login;
