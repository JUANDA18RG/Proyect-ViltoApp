import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { obtenerUrlImagen } from "../firebase/firebase.config";
import { toast } from "react-toastify";
import User from "../../assets/user.png";

export default function CompartirProyecto({ projectName, projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [imagenesUsuarios, setImagenesUsuarios] = useState({});
  const socket = useRef();
  const [numUsers, setNumUsers] = useState(0);
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
    const filteredResults = allUsers.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchTerm, allUsers]);

  function closeModal() {
    setIsOpen(false);
    setSearchTerm("");
    setSelectedUserEmail("");
    if (socket.current) {
      socket.current.disconnect();
    }
  }

  function openModal() {
    setSearchTerm("");
    setIsOpen(true);
    socket.current = io("http://localhost:3000");
    socket.current.on("connect", () => {
      console.log("Connected to server");
    });
    socket.current.on("searchResults", (results) => {
      console.log("Received search results", results);
      setAllUsers(results);
    });
    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedUserEmail("");
  };

  const handleUserClick = (email) => {
    setSelectedUserEmail(email);
    setSearchTerm(email);
  };

  // Función para manejar el clic en el botón "Agregar Usuario"
  const handleAddUserClick = () => {
    if (numUsers >= 4) {
      closeModal();
      toast.warning(
        "El proyecto ya tiene 4 participantes. No puedes agregar más."
      );
    } else if (selectedUserEmail) {
      socket.current.emit("agregarUsuario", {
        projectId,
        userEmail: selectedUserEmail,
      });
      toast.success("Usuario agregado correctamente refresh para ver cambios.");
      console.log(projectId, selectedUserEmail);
      closeModal();
    } else {
      closeModal();
      toast.error("Debes seleccionar un usuario para agregarlo al proyecto.");
    }
  };

  useEffect(() => {
    console.log("Search results updated", searchResults);
  }, [searchResults]);

  useEffect(() => {
    const socket = io.connect("http://localhost:3000");
    socket.emit("obtenerProyecto", projectId);
    socket.on("proyecto", (proyecto) => {
      console.log(`Proyecto: ${proyecto.name}`);
      if (proyecto.users) {
        setNumUsers(proyecto.users.length);
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
              setImagenesUsuarios((prev) => ({
                ...prev,
                [usuario.email]: User, // Establecer la imagen predeterminada cuando no se encuentra la imagen del usuario
              }));
            });
        });
      } else {
        console.log("No hay usuarios en este proyecto.");
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  return (
    <>
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-1 text-white hover:animate-jump">
        <button
          className="relative flex items-center justify-center space-x-2 md:space-x-2 p-1 w-full "
          onClick={openModal}
          key={projectId}
        >
          <span className="hidden md:inline text-lg md:text-sm ">
            Compartir
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 shadow-sm overflow-y-auto"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto animate-jump-in">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                    darkMode
                      ? "bg-gradient-to-t from-gray-800 to-gray-900"
                      : "bg-gradient-to-t from-gray-300 to-white"
                  }`}
                >
                  {" "}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 justify-center items-center flex "
                  >
                    <h1
                      className={` text-xl font-bold text-center p-2 rounded-lg ${
                        darkMode
                          ? "text-white bg-gray-700"
                          : "text-black bg-white"
                      }`}
                    >
                      <span>
                        Compartir el proyecto {projectName} con otros usuarios
                      </span>
                    </h1>
                  </Dialog.Title>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={selectedUserEmail || searchTerm}
                      onChange={handleSearchChange}
                      className="w-full p-2 border-2 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50 rounded-md"
                      placeholder="Buscar usuarios..."
                    />
                    {searchTerm && (
                      <div
                        className={`relative border rounded mt-2 w-full ${
                          darkMode ? "bg-gray-600" : "bg-white"
                        } ${
                          searchResults.length >= 2
                            ? "h-40 overflow-y-auto"
                            : "h-26"
                        }`}
                      >
                        {searchResults.length > 0 ? (
                          searchResults.map((result) => (
                            <li
                              key={result.id}
                              className={`p-2 m-5 rounded-md cursor-pointer ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() => handleUserClick(result.email)}
                            >
                              <div className="flex items-start rounded-md animate-fade-up">
                                <img
                                  src={imagenesUsuarios[result.email]}
                                  alt={`Imagen de ${result.email}`}
                                  className="rounded-full w-10 h-10 border-2 border-red-500 mt-1"
                                />
                                <div className="ml-2">
                                  <div
                                    className={`break-all ${
                                      darkMode ? "text-white" : "text-gray-800"
                                    }`}
                                  >
                                    {result.email}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {result.name}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p className="text-red-500 text-sm m-2 animate-fade-right flex items-center justify-center h-full">
                            No se encontró ningún usuario.
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-gray-500 text-justify mt-5">
                      En esta sección puedes buscar a los usuarios que deseas
                      agregar al proyecto puedes agregar a cualquier usuario que
                      este registrado en la plataforma y que no este ya en el
                      proyecto
                    </p>
                  </div>
                  <div className="mt-6 items-center justify-center text-center">
                    <button
                      type="button"
                      className="inline-flex justify-center bg-gradient-to-r from-red-500 to-pink-500 shadow-md text-white rounded-md p-2 "
                      onClick={handleAddUserClick}
                    >
                      Agregar Usuario
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

CompartirProyecto.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.string,
};
