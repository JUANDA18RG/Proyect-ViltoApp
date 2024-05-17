import SpaceWork from "./SpaceWork";
import NavbarPage from "../Home/NavbarPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/authContext"; // Asegúrate de importar el hook useAuth
import Spinner from "../Perfil/Spinner";

export default function AraTrabajo() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

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

  useEffect(() => {
    if (!loading && !user) {
      // Solo redirigimos a /404 si la carga ha terminado y no hay usuario
      navigate("/404");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.emit("obtenerProyecto", id);

    socket.on("proyecto", (project) => {
      setProject(project);
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      className={`bg-gradient-to-t ${
        darkMode ? "from-gray-800 to-gray-900" : "from-gray-300 to-white"
      } animate-fade-right h-screen overflow-x-hidden`}
    >
      <NavbarPage />
      {project && <SpaceWork projectId={id} project={project} />}
    </div>
  );
}
