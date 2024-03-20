import SpaceWork from "./SpaceWork";
import NavbarPage from "../Home/NavbarPage";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../App";

export default function AraTrabajo() {
  const { id } = useParams();
  const socket = useSocket();

  useEffect(() => {
    if (socket == null) return;

    socket.emit("join room", id);

    return () => {
      socket.emit("leave room", id);
    };
  }, [socket, id]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`http://localhost:4000/projects/${id}`);
      const data = await response.json();
      console.log(data);
    };
    fetchProjects();
  }, [id]);

  return (
    <div className="bg-gradient-to-b from-gray-200 to-white animate-fade-right h-screen overflow-x-hidden">
      <NavbarPage />
      <SpaceWork projectId={id} />
    </div>
  );
}
