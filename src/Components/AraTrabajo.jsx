import SpaceWork from "./SpaceWork";
import NavbarPage from "../Home/NavbarPage";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function AraTrabajo() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

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

  return (
    <div className="bg-gradient-to-t from-gray-300 to-white animate-fade-right h-screen overflow-x-hidden">
      <NavbarPage />
      {project && <SpaceWork projectId={id} project={project} />}
    </div>
  );
}
