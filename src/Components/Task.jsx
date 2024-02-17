// Task.js
import { useState } from "react";
import PropTypes from "prop-types";
import { useRef } from "react";

const Task = ({ columnId, onAddTask }) => {
  Task.propTypes = {
    onAddTask: PropTypes.func.isRequired,
  };
  const [newTaskText, setNewTaskText] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [image, setImage] = useState(null);

  const handleAddTask = () => {
    onAddTask(columnId, newTaskText, image);
    setNewTaskText("");
    setAddingTask(false);
    setImage(null);
  };

  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mt-6 flex items-center justify-center animate-jump-in  transition">
      {addingTask ? (
        <div
          className="flex items-center justify-between animate-jump-in m-2"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setAddingTask(false);
            }
          }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <textarea
              rows="1"
              cols="17"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Ingrese la tarea..."
              className="p-2 rounded-md resize-none flex-grow focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
            />
            <button
              id="sendButton"
              onClick={handleAddTask}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-1 rounded-md ml-2 hover:animate-jump"
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
            <button
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-1 rounded-md ml-2 hover:animate-jump"
              onClick={handleButtonClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
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
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingTask(true)}
          className="bg-gray-300 text-center items-center p-2 rounded-md flex text-gray-600 text-sm opacity-70"
        >
          Agregar Tarea
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

Task.propTypes = {
  columnId: PropTypes.node.isRequired,
};

export default Task;
