import { useEffect, useState } from "react";
import io from "socket.io-client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { obtenerUrlImagen } from "../firebase/firebase.config";
import "react-loading-skeleton/dist/skeleton.css";
import userImage from "/assets/user.png";

export default function Miembros() {
  const [darkMode, setDarkMode] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingSkeleton(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isEnabled = JSON.parse(savedDarkMode) || false;
    setDarkMode(isEnabled);

    const handleDarkModeChange = () => {
      const saved = localStorage.getItem("darkMode");
      const isEnabled = JSON.parse(saved) || false;
      setDarkMode(isEnabled);
    };

    window.addEventListener("darkModeChange", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("obtenerUsuarios");

    socket.on("usuarios", async (data) => {
      setUsers(data);
      for (const user of data) {
        obtenerUrlImagen(user.email)
          .then((url) => {
            setUserImages((prev) => ({
              ...prev,
              [user.email]: url || userImage, // Usa la imagen predeterminada si no se encuentra una URL
            }));
          })
          .catch((error) => {
            console.error("Error obteniendo la imagen del usuario:", error);
            setUserImages((prev) => ({
              ...prev,
              [user.email]: userImage, // Usa la imagen predeterminada en caso de error
            }));
          });
      }
    });

    return () => {
      socket.off("usuarios");
    };
  }, []);

  return (
    <div
      className={`w-4/5 h-screen overflow-y-auto mt-2 relative animate-fade-up ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-t from-gray-100 to-white text-gray-900"
      }`}
    >
      <div
        className="absolute inset-0 bg-bottom bg-no-repeat bg-cover transform rotate-180 opacity-60"
        style={{ backgroundImage: `url('/assets/wavesOpacity.svg')` }}
      ></div>
      <div className="flex flex-wrap justify-center z-50 mt-10">
        {users.map((user) => (
          <div
            key={user._id}
            className={`m-6 w-64 shadow-lg rounded-lg overflow-hidden transform transition-all duration-500 ease-in-out ${
              darkMode
                ? "bg-gray-600 text-white border-2"
                : "bg-white text-black border-2"
            } hover:scale-105`}
          >
            {loadingSkeleton ? (
              <div className="flex flex-col items-center justify-center p-6">
                <SkeletonTheme
                  baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                  highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                >
                  <Skeleton circle={true} width={80} height={80} />
                  <Skeleton width={100} height={20} className="mt-4" />
                </SkeletonTheme>
              </div>
            ) : (
              <div className="flex flex-col items-center p-6">
                <img
                  src={userImages[user.email] || userImage}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <div className="text-center mt-4 w-full">
                  <h3 className="text-lg font-semibold truncate">
                    {user.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
