import { useState, useEffect } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

export default function ProyectosFavoritos({ projectId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const socket = io("http://localhost:3000");
  const { user } = useAuth();

  // obtener el correo del usuario
  const userEmail = user.email;

  useEffect(() => {
    // Emitir un evento para obtener el estado de favorito actual del proyecto
    socket.emit("obtenerEstadoFavorito", { projectId, userEmail });

    socket.on("estadoFavorito", (data) => {
      if (data.projectId === projectId) {
        setIsFavorite(data.isFavorite);
      }
    });

    socket.on("estadoFavoritoCambiado", (data) => {
      if (data.projectId === projectId) {
        setIsFavorite(data.isFavorite);
      }
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, userEmail, socket]);

  const handleClick = () => {
    socket.emit("toggleFavorito", { projectId, userEmail });
    toast.success(
      `Proyecto ${isFavorite ? "desmarcado" : "marcado"} como favorito`
    );
  };

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 text-white hover:animate-jump">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-5 h-5 cursor-pointer`}
        onClick={handleClick}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          fill={isFavorite ? "white" : "transparent"}
        />
      </svg>
    </div>
  );
}

ProyectosFavoritos.propTypes = {
  projectId: PropTypes.string.isRequired,
};
