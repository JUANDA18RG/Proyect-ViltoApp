// AddColumn.js
import { useState } from "react";
import PropTypes from "prop-types";

const AddColumn = ({ onAddColumn }) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleShowAddColumn = () => {
    setShowAddColumn(true);
  };

  const handleConfirmAddColumn = () => {
    const title = newColumnTitle || `New Column`;
    onAddColumn(title);
    setNewColumnTitle("");
    setShowAddColumn(false);
  };

  return (
    <div className="flex items-center justify-center animate-jump-in">
      {showAddColumn ? (
        <div
          className="flex items-center justify-between animate-jump-in"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowAddColumn(false);
            }
          }}
        >
          <textarea
            type="text"
            rows="1"
            cols="20"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Enter new column title"
            className="p-2 rounded-md resize-none flex-grow border-2 border-gray-300"
          />
          <button
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-md ml-2"
            onClick={handleConfirmAddColumn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          className="bg-gray-300 text-center items-center p-2 rounded-md flex text-gray-600 text-sm opacity-70"
          onClick={handleShowAddColumn}
        >
          Add Column
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AddColumn;

AddColumn.propTypes = {
  onAddColumn: PropTypes.func.isRequired,
};
