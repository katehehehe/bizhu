import React, { useState } from "react";
import "../../styles/loginRegister.css";
import { useNavigate } from "react-router-dom";

function Login({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedin, setisLoggedin] = useState(false);

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
      setisLoggedin(false);

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
