import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

export default function ButtonAdd({ setWorks }) {
  let [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
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

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    if (auth.user) {
      const email = auth.user.email;
      socket.emit("obtenerEstadoPremium", email); // Nuevo evento para obtener el estado premium del usuario
    }

    socket.on("proyectoCreado", (project) => {
      // Actualiza el estado de los proyectos
      setWorks((prevWorks) => [...prevWorks, project]);
      toast.success(
        `El proyecto de nombre ${project.name} fue creado con exito.`,
        {
          autoClose: 3000,
        }
      );
      setName("");
      setDescription("");
      closeModal();
    });

    socket.on("estadoPremium", (estadoPremium) => {
      // Nuevo oyente para el estado premium del usuario
      setIsPremium(estadoPremium);
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.user, setWorks]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const userEmail = auth.user.email;

    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("obtenerProyectos", userEmail); // Solicita los proyectos del usuario

    socket.on("proyectos", (proyectos) => {
      // Recibe los proyectos del usuario
      if (!isPremium && proyectos.length >= 6) {
        // Si el usuario no es premium y tiene 6 o más proyectos
        toast.warning(
          "Solo puedes tener 6 proyectos, si deseas tener más proyectos puedes adquirir una membresía premium.",
          {
            autoClose: 5000,
          }
        );

        setName("");
        setDescription("");
        closeModal();

        return;
      }

      const project = {
        name,
        description,
        users: [{ email: userEmail }],
        userEmail,
      };

      socket.emit("crearProyecto", project);
    });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="relative flex items-center justify-center space-x-2 md:space-x-2  bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-2 text-white hover:animate-jump z-10 mr-2"
      >
        <span className="hidden md:inline text-sm md:text-sm">Add Project</span>
        <div className="md:flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </button>

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
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl ${
                    darkMode
                      ? "bg-gradient-to-t from-gray-800 to-gray-900"
                      : "bg-gradient-to-t from-gray-300 to-white"
                  }`}
                >
                  {" "}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6  justify-center items-center flex m-2 "
                  >
                    <h1 className=" uppercase text-xl font-bold text-center p-2 rounded-lg shadow-md">
                      <span
                        className={`px-3 py-1 rounded-md ${
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        Create Project
                      </span>
                    </h1>
                  </Dialog.Title>
                  <div className="mt-6 mb-5">
                    <p className="text-sm text-gray-500 text-justify">
                      here you can create a new collaborative project, alone you
                      need a name and description of your project to start to
                      work.
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className=" flex flex-col items-start justify-center text-left">
                      <span
                        className={`text-sm text-justify mb-4 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Project name:
                      </span>
                      <input
                        id="projectTitle"
                        type="text"
                        className="p-2 w-full border-2 rounded-lg bg-gray-100 border-red-500 focus:ring-red-500 focus:ring-opacity-50 mr-2 shadow-md"
                        placeholder="Project's name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-6 flex flex-col items-start justify-center text-left">
                      <span
                        className={`text-sm text-justify mb-4 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Project description:
                      </span>
                      <input
                        id="projectDescription"
                        type="text"
                        className="p-2 w-full border-2 rounded-lg bg-gray-100 border-red-500 focus:ring-red-500 focus:ring-opacity-50 mr-2 shadow-md"
                        placeholder="Project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 items-center justify-center text-center text-red-500">
                      {error}
                    </div>
                  )}
                  <div className="mt-6 items-center justify-center text-center ">
                    <button
                      type="button"
                      className="inline-flex justify-center bg-gradient-to-r from-red-500 to-pink-500 shadow-md text-white rounded-md p-2"
                      onClick={handleSubmit}
                    >
                      Create Project
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

ButtonAdd.propTypes = {
  setWorks: PropTypes.func.isRequired,
};
