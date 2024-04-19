import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { useAuth } from "../context/authContext";
import { obtenerUrlImagen } from "../firebase/firebase.config";
import User from "../../public/user.png";

let socket;

export default function ButtonChat({ projectId, projectName }) {
  ButtonChat.propTypes = {
    projectId: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
  };

  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [imagenesUsuarios, setImagenesUsuarios] = useState({});
  const messagesEndRef = useRef(null); // Referencia al elemento de mensajes

  useEffect(() => {
    socket = io("http://localhost:3000");

    socket.emit("obtenerProyecto", projectId);

    socket.on("mensajeEnviado", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg.message]);
    });

    socket.emit("obtenerMensajes", projectId);
    socket.on("mensajesObtenidos", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      // Esperar 100ms para asegurarse de que los mensajes se rendericen completamente
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(timeoutId); // Limpiar el temporizador al desmontar el componente
    }
  }, [isOpen, messages]); // Añadir messages al array de dependencias

  useEffect(() => {
    scrollToBottom(); // Desplazar el scroll hacia abajo cuando se agrega un nuevo mensaje
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("enviarMensaje", {
      projectId,
      message,
      sender: user.email,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.emit("obtenerProyecto", projectId);
    socket.on("proyecto", (proyecto) => {
      console.log(`Proyecto: ${proyecto.name}`);
      if (proyecto.users) {
        console.log("Usuarios en este proyecto:", proyecto.users);
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
                [usuario.email]: User,
              }));
            });
        });
      } else {
        console.log("No hay usuarios en este proyecto.");
      }
    });
  }, [projectId]);

  return (
    <>
      <button
        className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 text-white hover:animate-jump"
        onClick={openModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex overflow-y-auto"
          onClose={closeModal}
        >
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 w-1/2  pointer-events-auto cursor-pointer"
            onClick={closeModal}
          >
            <div className="relative rounded-md mb-2">
              <h1 className="relative text-xl text-center text-white p-2 flex bg-gradient-to-r from-red-500 to-pink-500 rounded-lg opacity-75">
                Salir del Chat
              </h1>
            </div>
          </div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="w-1/2 h-full overflow-hidden bg-gray-100 p-6 text-left align-middle shadow-xl fixed right-0 top-0 animate-fade-right">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 text-gray-900 justify-center items-center mb-12 text-center"
              >
                <h1 className="uppercase text-2xl  mb-4 font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-2 text-white">
                    {projectName}
                  </span>{" "}
                  - Chat del Proyecto
                </h1>
                <p className="text-sm text-gray-700 leading-relaxed mt-5">
                  Aquí puedes hablar con tus compañeros de proyecto. Esta
                  herramienta facilita la colaboración, haciendo el trabajo más
                  divertido y rápido.
                </p>
              </Dialog.Title>
              <div className="max-h-96 overflow-y-auto mb-4 bg-gray-200 rounded-lg">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      msg.sender === user.email
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-md mx-2">
                      <div
                        className={`bg-white rounded-lg p-3 shadow-md ${
                          msg.sender === user.email
                            ? "bg-gradient-to-r from-red-200 to-pink-200"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center mb-2 ">
                          <img
                            className="w-8 h-8 rounded-full mr-2 border-2 border-red-500"
                            src={imagenesUsuarios[msg.sender] || User}
                            alt="Avatar"
                          />
                          <p className="text-sm font-medium text-gray-900 opacity-60">
                            {msg.sender}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>{" "}
                {/* Referencia al final del contenedor de mensajes */}
              </div>
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow rounded-full border border-gray-300 focus:outline-none focus:border-red-500 p-3"
                  placeholder="Escribe tu mensaje..."
                />
                <button
                  type="submit"
                  className="mt-8 bg-gradient-to-r from-red-500 to-pink-500 ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white items-center mb-8"
                >
                  Enviar
                </button>
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
