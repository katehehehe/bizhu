import React, { useState, createContext } from "react";
import "../../styles/loginRegister.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../Main";

function Login({ onClose }) {
  const { isLoggedin, setIsLoggedin, setUsername, updateUser, user } =
    useContext(MainContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
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
      console.log("Response received:", response);
      const data = await response.json();
      console.log("Data received:", data);
      setIsLoggedin(true);
      localStorage.setItem("isLoggedin", "true");
      updateUser(data);
      setUsername(data.name);
      console.log("the current user is" + data.name);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <form
          className="signin-form"
          onSubmit={(e) => handleSubmit(e, navigate)}
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
