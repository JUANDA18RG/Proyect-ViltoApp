import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { useAuth } from "../context/authContext";

const AddColumn = ({ projectId }) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [name, setNewColumnTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isEnabled = JSON.parse(saved) || false;
    setDarkMode(isEnabled);

    const handleDarkModeChange = () => {
      const saved = localStorage.getItem("darkMode");
      const isEnabled = JSON.parse(saved) || false;
      setDarkMode(isEnabled);
    };

    window.addEventListener("darkModeChange", handleDarkModeChange);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  const handleShowAddColumn = () => {
    setShowAddColumn(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("columnaCreada", (column) => {
      console.log("Columna creada:", column);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleConfirmAddColumn = () => {
    const column = {
      name,
      projectId,
      userEmail: user.email,
    };
    const socket = io("http://localhost:3000");
    socket.emit("crearColumna", column);

    setNewColumnTitle("");
    setShowAddColumn(false);
  };

  const handleEmojiSelect = (emojiObject) => {
    setNewColumnTitle((prevText) => prevText + emojiObject.emoji);
    console.log(emojiObject.emoji);
  };

  return (
    <div className="flex items-center justify-center animate-jump-in m-4 pointer-events-auto ">
      {showAddColumn ? (
        <div
          className="flex items-center justify-between animate-jump-in"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowAddColumn(false);
            }
          }}
        >
          <div className="flex items-center justify-between animate-jump-in m-2">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative flex">
                <button
                  className="hover:animate-jump"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6  bg-gray-200 rounded-full m-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="new column title"
                  className="p-2 rounded-md resize-none flex-grow focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent w-40"
                />
                <button
                  id="sendButton"
                  onClick={handleConfirmAddColumn}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-1 rounded-md ml-2 hover:animate-jump m-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {showEmojiPicker && (
            <div className="absolute top-full">
              <Picker
                className="scale-75 origin-top-left"
                onEmojiClick={handleEmojiSelect}
                disableSearchBar={true}
                maxFrequentRows={0}
                previewPosition={"none"}
                theme={darkMode ? "dark" : "light"}
              />
            </div>
          )}
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

AddColumn.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default AddColumn;
