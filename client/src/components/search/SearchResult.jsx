import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SearchResult() {
  const location = useLocation();
  const matchingUsernames = location.state?.matchingUsernames || [];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <button
          onClick={handleBack}
          className="text-twitterBlue hover:text-blue-800 text-lg"
        >
          &lt; Back
        </button>
        <button
          className="text-twitterBlue hover:text-blue-800 text-lg"
          onClick={() => navigate("/")}
        >
          &lt; Home
        </button>
        <div className="my-3" />
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold mr-4">Search Result</h1>
        </div>
        {matchingUsernames.length === 0 ? (
          <p>No matching usernames found</p>
        ) : (
          <ul className="list-disc pl-4">
            {matchingUsernames.map((username) => (
              <li key={username} className="mb-2">
                <Link
                  to={`/users/${username}`}
                  className="text-twitterBlue  hover:text-blue-800 text-lg"
                >
                  {username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
