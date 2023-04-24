import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [matchingUsernames, setMatchingUsernames] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);

  const navigate = useNavigate();

  // Retrieve all existing usernames on component mount
  useEffect(() => {
    async function fetchUsernames() {
      const response = await axios.get("/api/usernames");
      setExistingUsernames(response.data);
    }

    fetchUsernames();
  }, []);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const matches = existingUsernames.filter((username) =>
      username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setMatchingUsernames(matches);
    // navigate("/searchresult");
    navigate("/searchresult", { state: { matchingUsernames: matches } });
  };

  return (
    <div className="flex items-center border rounded-md p-2">
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
  );
}

export default Search;
