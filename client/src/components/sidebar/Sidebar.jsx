import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";

function Sidebar() {
  const [searchValue, setSearchValue] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleSearchClick = () => {
    setShowSearchBox(true);
  };

  const handleSearchClose = (event) => {
    event.stopPropagation();
    setShowSearchBox(false);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen border-r border-gray-200 sidebar">
      <div className="flex h-16 items-center justify-center">
        <TwitterIcon className="text-blue-400 h-8 w-8" />
      </div>

      <SidebarOption active Icon={HomeIcon} />
      <div className="my-4 sidebar__twitterIcon" />

      <div className="relative">
        <div onClick={handleSearchClick}>
          <SidebarOption Icon={SearchIcon} />
        </div>
        {showSearchBox && (
          <div className="absolute top-0 left-full ml-3 z-50">
            <input
              type="text"
              placeholder="Search Twitter"
              className="w-64 h-12 border rounded-md border-gray-300 px-4 py-2 focus:outline-none"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-300 flex justify-center items-center"
              onClick={handleSearchClose}
            >
              X
            </button>
          </div>
        )}
      </div>

      <div className="my-4" />

      <Link to="/profile">
        <SidebarOption Icon={PermIdentityIcon} />
      </Link>
      <Button className="sidebar-button" type="submit">
        Tweet
      </Button>
    </div>
  );
}

export default Sidebar;
