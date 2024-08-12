import { useState, useEffect } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { useAuth } from "../context/authContext";

// Conecta el cliente de socket.io al servidor
const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function EditarColumna({ column, projectId, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);

  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    // Listener para columna editada
    const handleColumnaEditada = (updatedColumn) => {
      console.log("Columna editada recibida:", updatedColumn);
      onUpdate(updatedColumn);
      setIsEditing(false);
      toast.success("Column updated", { autoClose: 3000 });
    };

    // Listener para errores
    const handleError = (errorMessage) => {
      console.error("Error recibido:", errorMessage);
      toast.error(`Error: ${errorMessage}`, { autoClose: 3000 });
    };

    // Añadir los listeners
    socket.on("columnaEditada", handleColumnaEditada);
    socket.on("error", handleError);

    // Limpiar los listeners cuando el componente se desmonte o cambien las dependencias
    return () => {
      socket.off("columnaEditada", handleColumnaEditada);
      socket.off("error", handleError);
    };
  }, [onUpdate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    socket.emit("editarNombreColumna", {
      column,
      name,
      userEmail: user.email,
      projectId,
    });
    console.log("Evento emitido:", {
      column,
      name,
      userEmail: user.email,
      projectId,
    });
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col items-center p-2">
          <h2
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Edit column
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 p-2 mb-4 border-2 border-red-500 rounded bg-gray-200 items-center justify-center text-gray-800"
            placeholder="Column name"
          />
          <button
            onClick={handleSaveClick}
            className="flex items-center p-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-md text-white"
          >
            <span className="text-md">Save</span>
          </button>
        </div>
      ) : (
        <button
          className="flex items-center p-2 bg-blue-500 rounded-md text-white animate-jump-in"
          onClick={handleEditClick}
        >
          <span className="text-sm">Edit</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

EditarColumna.propTypes = {
  column: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};
