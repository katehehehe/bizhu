import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { TextField, Button } from "@mui/material";

function Search() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    // TODO: implement search logic
  };

  return (
    <div>
      <Button onClick={handleOpen}>Search</Button>
      <Modal open={open} onClose={handleClose}>
        <div className="search-modal">
          <form onSubmit={handleSubmit}>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Search;
