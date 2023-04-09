import React, { useState } from "react";
import "../styles/searchTab.css";
import axios from "axios";

function SearchTab() {
  const [searchText, setSearchText] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    // Search for users or posts based on searchText
    const response = await axios.get(`/api/search?text=${searchText}`);
    const searchResults = response.data;
    console.log(searchResults);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className="search-button">
          <i className="fa fa-search"></i>
        </button>
      </form>
    </div>
  );
}

export default SearchTab;
