import React, { useState, useContext } from "react";
import axios from "axios";
import { MainContext } from "../../Main";
import "../../styles/newPostForm.css";

function NewPostForm({ onNewPost }) {
  const [content, setContent] = useState("");
  const { user } = useContext(MainContext);
  const [image, setImage] = useState(null);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // update the state with the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting a new tweet...");
      const formData = new FormData(); // create a new FormData object
      formData.append("content", content); // add the text content to the form data
      console.log("A image is uploaded", image);
      if (image) {
        formData.append("image", image); // add the image file to the form data
        console.log("form data:", formData);
      }

      const response = await axios.post(
        "http://localhost:1337/api/tweet",
        formData, // use the form data as the request body
        {
          headers: {
            "Content-Type": "multipart/form-data", // set the content type header to multipart/form-data
          },
        }
      );
      console.log("Response received:", response);
      const data = response.data;
      console.log("New post created:", data);
      onNewPost(data);
      setContent("");
      setImage(null); // reset the image state after submitting the form
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  return (
    <form className="new-post-form flex" onSubmit={handleSubmit}>
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
      <div className="flex flex-row justify-between w-full">
        <div className="image-upload inline-block mx-2">
          <input type="file" id="image" onChange={handleImageChange} />
          <label htmlFor="image">
            <i className="fas fa-image"></i>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg max-w-120 align-self-end"
        >
          Tweet
        </button>
      </div>
    </form>
  );
}

export default NewPostForm;
