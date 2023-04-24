import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../Main";
import "../../styles/user.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, setUsername, setIsLoggedin } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = () => {
      setIsOpen(false);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = async () => {
    try {
      setIsOpen(false);
      setUsername("");
      setIsLoggedin(false);
      localStorage.removeItem("isLoggedIn");
      await fetch("/api/logOut", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  return (
    <div className="user relative">
      <button onClick={handleMenuClick}>
        <AccountCircleIcon className="text-3xl ml-4 mr-1" />{" "}
        {/* increase icon size and add margin to the right */}
      </button>
      {isOpen && (
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default User;
