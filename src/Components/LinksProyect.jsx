import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";

export default function LinksProyect({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const socketRef = useRef(null);

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
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.emit("joinProject", projectId);

    socket.emit("obtenerLinks", { projectId });

    socket.on("links", (links) => {
      setLinks(links);
    });

    socket.on("linkIngresado", (newLink) => {
      console.log("Nuevo enlace recibido:", newLink);
      setLinks((prevLinks) => [...prevLinks, newLink]);
    });

    socket.on("linkEliminado", (deletedLinkId) => {
      setLinks((prevLinks) =>
        prevLinks.filter((link) => link._id !== deletedLinkId)
      );
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    return () => {
      socket.off("links");
      socket.off("linkIngresado");
      socket.off("linkEliminado");
      socket.off("error");
      socket.disconnect();
    };
  }, [projectId]);

  const handleAddLink = () => {
    if (socketRef.current) {
      socketRef.current.emit(
        "ingresarLink",
        { projectId, link: newLink },
        (error, response) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Link added:", response);
            setNewLink("");
          }
        }
      );
    }
  };

  const handleDeleteLink = (linkId) => {
    if (socketRef.current) {
      socketRef.current.emit("eliminarLink", { projectId, linkId }, (error) => {
        if (error) {
          console.error(error);
        }
      });
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <div className="flex items-center hover:animate-jump">
        <button
          type="button"
          onClick={openModal}
          className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 justify-center items-center flex"
                  >
                    <span
                      className={`uppercase text-xl font-bold text-center rounded-lg shadow-md m-2 p-2 ${
                        darkMode
                          ? "text-white bg-gray-700"
                          : "text-black bg-white"
                      }`}
                    >
                      Sección Para Links de Información del Proyecto
                    </span>
                  </Dialog.Title>
                  <div className="mt-6 space-y-4 h-60 overflow-y-auto overflow-x-hidden">
                    {links.length === 0 ? (
                      <div
                        className={`flex items-center justify-center h-full text-center rounded-lg ${
                          darkMode
                            ? "text-white bg-gray-700"
                            : "text-black bg-gray-200"
                        }`}
                      >
                        No hay links agregados
                      </div>
                    ) : (
                      links.map((link, index) => (
                        <div
                          key={index}
                          className="group flex justify-between items-center p-3 bg-gray-200 rounded-md shadow-sm hover:bg-gradient-to-r from-red-500 to-pink-500 hover:text-white transition duration-200 m-2 border-2 border-gray-400"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            {link.url}
                          </a>
                          <button
                            onClick={() => handleDeleteLink(link._id)}
                            className="opacity-0 group-hover:opacity-100 transition duration-200 rounded-full bg-white p-1 z-10"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-5 w-5 text-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.086-2.25a51.964 51.964 0 0 0-3.828 0c-1.176.086-2.086 1.07-2.086 2.25v.916m7.5 0a48.08 48.08 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-6 flex items-center m-2">
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="Ingresar nuevo link"
                      className="p-2 border rounded-md flex-grow focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={handleAddLink}
                      className="ml-2 p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md shadow-md "
                    >
                      Agregar Link
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white "
                      onClick={closeModal}
                    >
                      Cerrar
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

LinksProyect.propTypes = {
  projectId: PropTypes.string.isRequired,
};
