import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/tweet.css";
import { Buffer } from "buffer";
import BackspaceIcon from "@mui/icons-material/Backspace";
import EditTweetModal from "../personalPage/EditTweetModal";
import EditIcon from "@mui/icons-material/Edit";

function Tweet({ tweet, user, canDelete, handleDelete, handleUpdate }) {
  const { username, createdAt, image, id } = tweet;
  const [imageData, setImageData] = useState(null);
  const date = new Date(Date.parse(createdAt));
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  let timeAgo;
  if (diffMinutes < 60) {
    timeAgo = `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours}h ago`;
  } else {
    timeAgo = `${Math.floor(diffHours / 24)}d ago`;
  }
  const [content, setContent] = useState(tweet.content);
  const [editContent, setEditContent] = useState(tweet.content);
  const [updatedContent, setUpdatedContent] = useState(tweet.content);

  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (image && image.data) {
      const base64String = Buffer.from(image.data).toString("base64");
      setImageData(`data:${image.contentType};base64,${base64String}`);
    }
  }, [image]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirmation(false);
  };

  const handleSave = () => {
    handleUpdate(id, content);
    setIsEditing(false);
  };
  const handleUpdateClick = async () => {
    await handleUpdate(tweet._id, editContent);
    setUpdatedContent(editContent);
    setShowEditModal(false);
  };

  return (
    <Link to={`/users/${username}`} className="tweet-link">
      <div className="tweet-wrapper">
        <div className="tweet">
          <div className="header">
            {user && (
              <img className="tweet-avatar" src={user.avatar} alt="hey" />
            )}
            <h2 className="username">{username}</h2>
            {timeAgo && <p className="time-ago text-gray-500">{timeAgo}</p>}
          </div>
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p className="content text-gray-800">{content}</p>

                {canDelete && (
                  <button
                    className="delete-button"
                    onClick={handleConfirmation}
                  >
                    <BackspaceIcon />
                  </button>
                )}

                {canDelete && (
                  <button
                    className="text-blue-500 hover:underline edit-button"
                    onClick={() => {
                      setEditContent(tweet.content);
                      setShowEditModal(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                )}
              </>
            )}
          </div>
          {showEditModal && (
            <EditTweetModal
              tweet={tweet}
              updatedContent={editContent}
              setUpdatedContent={setEditContent}
              handleClose={() => setShowEditModal(false)}
              handleUpdateClick={handleUpdateClick}
            />
          )}
          {imageData && (
            <img src={imageData} alt="tweet" className="tweet-post-img" />
          )}
          {showConfirmation && (
            <div className="delete-confirmation">
              <p>Are you sure you would like to delete this tweet?</p>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleConfirmDelete}>Yes</button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
export default Tweet;
