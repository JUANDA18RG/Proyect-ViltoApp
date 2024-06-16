import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/authContext";

export default function ActividadUsuario() {
  const [acciones, setAcciones] = useState([]); // Estado para guardar las acciones del usuario
  const { user } = useAuth(); // Obtiene el usuario actual del contexto de autenticación
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
    const socket = io(import.meta.env.VITE_BACKEND_URL); // Conecta al servidor de socket
    socket.emit("obtenerAcciones", { userEmail: user.email }); // Emite el evento 'obtenerAcciones' con el correo electrónico del usuario

    socket.on("acciones", (acciones) => {
      // Escucha el evento 'acciones'
      setAcciones(acciones);
      console.log(acciones);
    });

    return () => {
      socket.disconnect(); // Desconecta del servidor de socket cuando el componente se desmonta
    };
  }, [user.email]);

  return (
    <div
      className={`bg-gray-100 flex justify-center items-center m-8 animate-fade-up ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full shadow-lg  p-8 rounded-lg ${
          darkMode
            ? "bg-gray-800 border-2 border-gray-700"
            : "bg-white border-2 border-gray-300"
        }`}
      >
        <h2
          className={`text-lg font-bold mb-7 text-center items-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Your last actions
        </h2>
        {acciones.length > 0 ? (
          <div className="space-y-6 overflow-auto max-h-80">
            {acciones
              .slice()
              .reverse()
              .map((accion, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center hover:scale-105 transition duration-300 ease-in-out p-3 rounded-lg hover:bg-gradient-to-r from-red-500 to-pink-500 hover:text-white shadow-md cursor-pointer m-8 ${
                    darkMode ? "bg-gray-500" : "bg-gray-100"
                  }`}
                >
                  <span className=" text-lg overflow-auto whitespace-normal break-words">
                    {accion.accion}
                  </span>
                  <span className="bg-white rounded-lg p-1 m-2 text-gray-500 opacity-90">
                    {new Date(accion.fecha).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-center flex">
              There are no actions available.
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 ml-2 items-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
