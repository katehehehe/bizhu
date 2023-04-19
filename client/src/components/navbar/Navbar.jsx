import React, { useState, useContext } from "react";
import "../../styles/navbar.css";
import Login from "./Login";
import Register from "./Register";
import User from "./User";
import { MainContext } from "../../Main";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { isLoggedin, username } = useContext(MainContext);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseClick = () => {
    setShowLogin(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleCloseRegisterClick = () => {
    setShowRegister(false);
  };

  if (!isLoggedin) {
    return (
      <div>
        <div className="flex items-center navbar-buttons">
          <>
            <button
              className="navbar-button rounded-full mr-4 bg-twitterBlue"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="navbar-button rounded-full bg-twitterBlue new-botton"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </>
        </div>
        {showLogin && <Login onClose={handleCloseClick} />}
        {showRegister && <Register onClose={handleCloseRegisterClick} />}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center navbar-buttons">
        <div className="flex items-center">
          <User />
          <span className="navbar-username text-lg font-bold">
            {username}
          </span>{" "}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
