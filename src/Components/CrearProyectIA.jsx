import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import PropTypes from "prop-types";

export default function CrearProyectIA({ setWorks }) {
  let [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

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

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);
    const userEmail = auth.user.email;
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.emit("obtenerProyectos", userEmail);

    socket.on("proyectos", (proyectos) => {
      if (!isPremium && proyectos.length >= 6) {
        toast.warning(
          "Solo puedes tener 6 proyectos, si deseas tener más proyectos puedes adquirir una membresía premium.",
          { autoClose: 5000 }
        );
        setDescription("");
        closeModal();
        setIsLoading(false);
        return;
      }

      socket.on("estadoPremium", (estadoPremium) => {
        setIsPremium(estadoPremium);
      });

      const project = { description, userEmail };

      socket.emit("crearProyectoConIA", project);

      socket.on("proyectoCreadoConIA", (project) => {
        const newProject = JSON.parse(project);
        setWorks((prevWorks) => [...prevWorks, newProject]);
        toast.success("Proyecto creado con Inteligencia artificial.", {
          autoClose: 5000,
        });
        setDescription("");
        closeModal();
        setIsLoading(false);
        socket.off("proyectoCreadoConIA");
        socket.off("error");
      });
    });

    socket.on("error", (errorMessage) => {
      toast.error(errorMessage, { autoClose: 5000 });
      setIsLoading(false);
      socket.off("error");
    });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-gradient-to-bl from-red-500 to-pink-500 rounded-md text-white hover:animate-jump z-10 ml-5 relative flex items-center justify-center space-x-2 md:space-x-2 p-2"
      >
        <span className="hidden md:inline text-sm md:text-sm">
          Create Project with AI
        </span>
        <div className="md:flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 justify-center items-center flex m-2"
                  >
                    <h1 className="uppercase text-xl font-bold text-center p-2 rounded-lg shadow-md">
                      <span
                        className={`px-3 py-1 rounded-md ${
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        Create Project with AI
                      </span>
                    </h1>
                  </Dialog.Title>
                  <div className="mt-6 mb-5">
                    <p className="text-sm text-gray-500 text-justify">
                      Here you can create a project with artificial
                      intelligence. Give a clear and accurate description so
                      that the AI believes you the project and you just have to
                      work on it.
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-start justify-center text-left">
                      <span
                        className={`text-sm text-justify mb-4 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Project description:
                      </span>
                      <textarea
                        className="w-full p-2 rounded-md shadow-md border-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Project description..."
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 items-center justify-center text-center text-red-500">
                      {error}
                    </div>
                  )}
                  <div className="mt-6 items-center justify-center text-center">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg
                          aria-hidden="true"
                          className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-300 fill-red-500"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center bg-gradient-to-r from-red-500 to-pink-500 shadow-md text-white rounded-md p-2"
                        onClick={handleSubmit}
                      >
                        Create Project with AI
                      </button>
                    )}
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

CrearProyectIA.propTypes = {
  setWorks: PropTypes.func.isRequired,
};
