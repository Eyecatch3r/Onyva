import React from "react";

const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a location"
      onChange={(event) => onSearch(event.target.value)}
    />
  );
};

export default SearchBar;