// Task.js
import { useState } from "react";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";
import { toast } from "react-toastify";
import { useSocket } from "../App";

const Task = ({ columnId, onTaskCreated }) => {
  Task.propTypes = {
    columnId: PropTypes.node.isRequired,
    onTaskCreated: PropTypes.func.isRequired,
  };

  const [newTaskText, setNewTaskText] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = useSocket();

  const handleAddTask = () => {
    if (!newTaskText) {
      toast.error("La tarea no puede estar vacía", {
        autoClose: 3000,
      });
      return;
    }
    const taskData = {
      name: newTaskText,
      columnId: columnId,
    };
    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        console.log("Success:", data);
        onTaskCreated(data, columnId); // Ahora data debería ser un objeto JSON
        setAddingTask(false);
        setNewTaskText("");
        socket.emit("task created", data);
        toast.success(`La tarea de nombre ${newTaskText} fue creada.`, {
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Hubo un error al crear la tarea", {
          autoClose: 3000,
        });
      });
  };

  const handleEmojiSelect = (emojiObject) => {
    setNewTaskText((prevText) => prevText + emojiObject.emoji);
    console.log(emojiObject.emoji);
  };

  return (
    <div className="mt-6 flex items-center justify-center animate-jump-in transition mr-1 ml-1">
      {addingTask ? (
        <div
          className="flex flex-col items-center"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setAddingTask(false);
            }
          }}
        >
          <div className="flex items-center justify-between animate-jump-in m-2">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative flex">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="hover:animate-jump"
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
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  type="text"
                  placeholder="Ingrese la tarea..."
                  className="p-2 rounded-md resize-none flex-grow focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent w-40"
                />
              </div>
            </div>
            <div className="flex items-center text-sm md:text-base">
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
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-1 rounded-md ml-2 hover:animate-jump">
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
          {showEmojiPicker && (
            <div className="relative left-12 top-10">
              <Picker
                onEmojiClick={handleEmojiSelect}
                className="scale-75 origin-top-left z-50"
                disableSearchBar={true}
                maxFrequentRows={0}
                previewPosition={"none"}
                theme={"light"}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setAddingTask(true)}
          className="bg-gray-300 text-center items-center p-2 rounded-md flex text-gray-600 text-sm opacity-70 mb-4"
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
