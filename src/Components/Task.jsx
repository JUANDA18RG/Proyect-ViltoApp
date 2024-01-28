// Task.js
import { useState } from "react";

import PropTypes from "prop-types";

const Task = ({ onAddTask }) => {
  Task.propTypes = {
    onAddTask: PropTypes.func.isRequired,
  };
  const [newTaskText, setNewTaskText] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const handleAddTask = () => {
    onAddTask(newTaskText);
    setNewTaskText("");
    setAddingTask(false);
  };

  return (
    <div className="mt-6 flex items-center justify-center">
      {addingTask ? (
        <div className="mt-4 flex items-center justify-between">
          <textarea
            rows="1"
            cols="20"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onBlur={(e) => {
              if (e.relatedTarget !== document.getElementById("sendButton")) {
                setAddingTask(false);
              }
            }}
            placeholder="Ingrese la nueva tarea"
            className="p-2 rounded-md resize-none flex-grow"
          />
          <button
            id="sendButton"
            onClick={handleAddTask}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-md ml-2"
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
          onClick={() => setAddingTask(true)}
          className="bg-gray-300 text-center items-center p-2 rounded-md flex"
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

export default Task;
