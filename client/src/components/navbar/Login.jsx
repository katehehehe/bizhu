import React, { useState, createContext, useEffect } from "react";
import "../../styles/loginRegister.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../Main";

function Login({ onClose }) {
  const { setIsLoggedin, setUsername, updateUser } = useContext(MainContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting login form...");
      const response = await fetch("http://localhost:1337/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("the email is ", email);
      console.log("the password is ", password);
      console.log("Response received:", response);
      const data = await response.json();
      console.log("Data received:", data);
      if (data.token) {
        // If a JWT token is received, set it in local storage
        localStorage.setItem("token", data.token);

        // Set the isLoggedIn flag and current user data in the MainContext
        setIsLoggedin(true);
        localStorage.setItem("isLoggedin", "true");
        updateUser(data);
        setUsername(data.name);
        console.log("the current user is" + data.name);

        onClose();
      } else {
        console.error("Failed to receive JWT token from server.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <form
          className="signin-form"
          onSubmit={(e) => handleLogin(e, navigate)}
        >
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
