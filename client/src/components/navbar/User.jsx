import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../Main";
import "../../styles/user.css";

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, setUsername, setUser, setIsLoggedin } =
    useContext(MainContext);
  const navigate = useNavigate();
  const userRef = useRef();

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedin");
    setUsername("");
    setUser(null);
    setIsLoggedin(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={userRef} className="user relative">
      <div
        onClick={handleMenuClick}
        className="flex items-center justify-center w-32 h-8 rounded-md bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none px-2"
      >
        <span className="mr-1 font-medium">{userName}</span>
      </div>

      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg">
          <button
            onClick={handleProfileClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
          >
            Profile
          </button>
          <button
            onClick={handleLogoutClick}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
