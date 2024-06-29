import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../context/authContext";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function Search() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const auth = useAuth();

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

    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    socket.on("proyectosEncontrados", (proyectos) => {
      console.log("Proyectos recibidos:", proyectos);
      setResults(proyectos);
    });

    return () => {
      socket.off("proyectosEncontrados");
    };
  }, []);

  useEffect(() => {
    if (query.trim() !== "" && auth.user) {
      console.log(
        "Buscando proyectos con query:",
        query,
        "y email:",
        auth.user.email
      ); // Debugging
      socket.emit("buscarProyectos", { query, email: auth.user.email });
    } else {
      setResults([]);
    }
  }, [query, auth.user]);

  return (
    <div className="relative right-32">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pl-10 p-1 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-transparent w-80 transform transition-all duration-300 ${
          darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-black"
        }`}
        style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      {results.length > 0 ? (
        <ul
          className={`absolute ${
            darkMode ? "bg-gray-800" : "bg-white"
          } border ${
            darkMode ? "border-gray-600" : "border-gray-300"
          } w-80 mt-2 rounded-lg shadow-lg`}
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {results.map((project) => (
            <Link
              to={`/AreaTrabajo/${project.id}`}
              key={project.id}
              className={`block p-2 transition-all duration-300 ${
                darkMode
                  ? "text-white hover:bg-gray-700"
                  : "text-black hover:bg-gray-200"
              }`}
              style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
            >
              {project.name}
            </Link>
          ))}
        </ul>
      ) : (
        query.trim() !== "" && (
          <div
            className={`absolute ${
              darkMode ? "bg-gray-800" : "bg-white"
            } border ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } w-80 mt-2 rounded-lg shadow-lg p-4 text-center`}
          >
            <p className="text-base text-red-500">No search results found</p>
          </div>
        )
      )}
    </div>
  );
}
