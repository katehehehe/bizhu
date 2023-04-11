import React, { useState, useContext } from "react";
import "../../styles/navbar.css";
import Login from "./Login";
import Register from "./Register";
import User from "./User";
import { MainContext } from "../../Main";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

        <div className="flex items-center">
          <User />
          {username && <span className="ml-2">{username}</span>}
          <AccountCircleIcon className="text-2xl ml-4" />
        </div>
      </div>
      {showLogin && <Login onClose={handleCloseClick} />}
      {showRegister && <Register onClose={handleCloseRegisterClick} />}
    </div>
  );
}

export default Navbar;
