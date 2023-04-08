import React, { useState, useContext } from "react";
import "../../styles/navbar.css";
import Login from "./Login";
import Register from "./Register";

function Navbar({}) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
    <div className="flex flex-row items-center justify-between h-16">
      <p className="text-center text-4xl flex-grow">Twitter Clone</p>

      <div className="flex">
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
      </div>
      {showLogin && <Login onClose={handleCloseClick} />}
      {showRegister && <Register onClose={handleCloseRegisterClick} />}
    </div>
  );
}

export default Navbar;
