import { useState, useEffect } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

// Conecta el cliente de socket.io al servidor
const socket = io("http://localhost:3000");

export default function EditarProyecto({ project, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  useEffect(() => {
    // Listener para proyecto editado
    const handleProyectoEditado = (updatedProject) => {
      toast.success("Proyecto editado con éxito.", { autoClose: 3000 });
      onUpdate(updatedProject);
      setIsEditing(false);
    };

    // Listener para errores
    const handleError = (errorMessage) => {
      toast.error(`Error: ${errorMessage}`, { autoClose: 3000 });
    };

    // Añadir los listeners
    socket.on("proyectoEditado", handleProyectoEditado);
    socket.on("error", handleError);

    // Limpiar los listeners cuando el componente se desmonte o cambien las dependencias
    return () => {
      socket.off("proyectoEditado", handleProyectoEditado);
      socket.off("error", handleError);
    };
  }, [onUpdate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    socket.emit("editarProyecto", {
      projectId: project._id,
      name,
      description,
      userEmail: project.userEmail,
    });
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col items-center p-4">
          <h2 className="text-md font-semibold mb-2">Editar proyecto</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 p-2 mb-2 border-2 border-red-500 rounded"
            placeholder="Nombre del proyecto"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-14 p-2 mb-2 border-2 border-red-500 rounded resize-none"
            placeholder="Descripción del proyecto"
          />
          <button
            onClick={handleSaveClick}
            className="flex items-center p-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-md text-white"
          >
            <span className="text-sm">Guardar</span>
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

EditarProyecto.propTypes = {
  project: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
