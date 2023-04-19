import React, { useState } from "react";

import "../../styles/editTweetModal.css";

function EditTweetModal({
  tweet,
  updatedContent,
  setUpdatedContent,
  handleClose,
  handleUpdateClick,
}) {
  const handleChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-50 z-10 flex justify-center items-center">
      <div className="modal">
        <div className="modal-header">
          <p className="modal-title font-bold text-lg">Edit Tweet</p>
          <button className="modal-close-btn" onClick={handleClose}>
            Close
          </button>
        </div>
        <div className="modal-content">
          <textarea
            className="modal-textarea"
            value={updatedContent}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button className="modal-save-btn" onClick={handleUpdateClick}>
              Save
            </button>
            <button className="modal-cancel-btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTweetModal;
