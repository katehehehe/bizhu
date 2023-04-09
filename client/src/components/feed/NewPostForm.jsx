import React, { useState, useContext } from "react";
import axios from "axios";
import { MainContext } from "../../Main";
import "../../styles/newPostForm.css";

function NewPostForm({ onNewPost }) {
  const [content, setContent] = useState("");
  const { user } = useContext(MainContext);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting a new tweet...");
      const response = await axios.post("http://localhost:1337/api/tweet", {
        content,
      });
      console.log("Response received:", response);
      const data = response.data;
      console.log("New post created:", data);
      onNewPost(data);
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="new-post-form">
      <div className="form-content">
        {/* <img
          className="h-12 w-12 rounded-full"
          src={user.avatar}
          alt={`Profile image of ${user.name}`}
        /> */}
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder={`What's on your mind? `}
          className="border border-gray-400 rounded-lg py-2 px-4 resize-none focus:outline-none focus:border-blue-500 w-full"
        />
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
      >
        Tweet
      </button>
    </form>
  );
}

export default NewPostForm;
