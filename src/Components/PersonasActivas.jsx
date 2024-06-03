import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { obtenerUrlImagen } from "../firebase/firebase.config";
import User from "/assets/user.png";

export default function PersonasActivas({ projectId }) {
  const [imagenesUsuarios, setImagenesUsuarios] = useState({});

  useEffect(() => {
    const socket = io.connect(import.meta.env.VITE_BACKEND_URL);
    socket.emit("obtenerProyecto", projectId);
    socket.on("proyecto", (proyecto) => {
      console.log(`Proyecto: ${proyecto.name}`);
      if (proyecto.users) {
        console.log("Usuarios en este proyecto:", proyecto.users);
        proyecto.users.forEach((usuario) => {
          obtenerUrlImagen(usuario.email)
            .then((url) => {
              setImagenesUsuarios((prev) => ({
                ...prev,
                [usuario.email]: url,
              }));
            })
            .catch((error) => {
              console.error("Error obteniendo la imagen del usuario:", error);
              // Si hay un error al obtener la imagen del usuario, establece la imagen predeterminada
              setImagenesUsuarios((prev) => ({
                ...prev,
                [usuario.email]: User,
              }));
            });
        });
      } else {
        console.log("No hay usuarios en este proyecto.");
      }
    });

    // Escucha el evento 'usuarioAgregado'
    socket.on("usuarioAgregado", (data) => {
      if (data.projectId === projectId) {
        obtenerUrlImagen(data.user.email)
          .then((url) => {
            setImagenesUsuarios((prev) => ({
              ...prev,
              [data.user.email]: url,
            }));
          })
          .catch((error) => {
            console.error("Error obteniendo la imagen del usuario:", error);
            setImagenesUsuarios((prev) => ({
              ...prev,
              [data.user.email]: User,
            }));
          });
      }
    });

    return () => {
      socket.off("proyecto");
      socket.off("usuarioAgregado");
      socket.disconnect();
    };
  }, [projectId]);

  return (
    <div className="text-sm">
      {Object.entries(imagenesUsuarios).map(([nombreUsuario, urlImagen]) => (
        <div key={nombreUsuario} className="relative group inline-block mr-1">
          <img
            src={urlImagen}
            alt={`Imagen de ${nombreUsuario}`}
            className="rounded-full w-10 h-10 border-2 border-red-500 mt-1 hover:scale-110 transition-transform duration-200"
          />
          <div className="absolute left-0 top-full mt-2 px-2 py-1 text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {nombreUsuario}
          </div>
        </div>
      ))}
    </div>
  );
}

PersonasActivas.propTypes = {
  projectId: PropTypes.string.isRequired,
};
