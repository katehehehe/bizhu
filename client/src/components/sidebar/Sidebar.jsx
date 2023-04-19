import React, {
  useState,
  useContext,
  useEffect,
  createContext,
  useRef,
} from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { MainContext } from "../../Main";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const [searchValue, setSearchValue] = useState("");

  const { isLoggedin, username } = useContext(MainContext);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [matchingUsernames, setMatchingUsernames] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  console.log("logged in? ", isLoggedin);

  const handleSearchClick = () => {
    setShowSearchBox(!showSearchBox);
  };
  useEffect(() => {
    async function fetchUsernames() {
      const response = await axios.get("http://localhost:1337/api/usernames");
      setExistingUsernames(response.data);
    }

    fetchUsernames();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const matches = existingUsernames.filter((username) =>
      username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setMatchingUsernames(matches);
    navigate("/searchresult", { state: { matchingUsernames: matches } });
  };
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showSearchBox &&
        !event.target.closest(".sidebar-search-tab") &&
        !event.target.closest(".sidebar__otherIcon")
      ) {
        setShowSearchBox(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showSearchBox]);

  return (
    <div className="flex flex-col h-screen sidebar">
      <div className="my-4" />
      <div className="flex h-16 items-center justify-center ">
        <TwitterIcon className="text-blue-400 h-8 w-8 sidebar__twitterIcon" />
      </div>

      <div className="my-4" />
      <div className="flex h-16 items-center justify-center ">
        <Link to="/">
          <HomeIcon className="sidebar__otherIcon" />
        </Link>
      </div>

      <div className="my-4" />
      <div className="flex h-16 items-center justify-center ">
        <SearchIcon
          className="sidebar__otherIcon"
          onClick={handleSearchClick}
        />

        {showSearchBox && (
          <div className="sidebar-search-tab">
            <div className="flex items-center rounded-md p-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
              <form onSubmit={handleSearchSubmit}>
                <input
                  className="flex-1 bg-transparent focus:outline-none"
                  // type="text"
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="my-4" />
      {isLoggedin ? (
        <>
          <div className="flex h-16 items-center justify-center ">
            <Link to="/profile">
              <PermIdentityIcon className="sidebar__otherIcon" />
            </Link>
          </div>
          <div className="my-4" />
          <div className="flex h-16 items-center justify-center ">
            <Link to={`/users/${username}`}>
              <EditCalendarIcon className="sidebar__otherIcon" />
            </Link>
          </div>
          <div className="my-4" />
        </>
      ) : null}
    </div>
  );
}

export default Sidebar;
