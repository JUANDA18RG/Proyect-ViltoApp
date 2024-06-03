import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Tab } from "@headlessui/react";

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(false);
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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  let [Ayuda] = useState({
    Uso: [
      {
        id: 1,
        title: "Crear Columnas",
        Descripcion:
          " Para crear una columna, haga clic en el botón 'Añadir columna' en la parte derecha de la pantalla. Luego, escriba el nombre de la columna y presione Enter.",
      },
      {
        id: 2,
        title: "Crear Tareas",
        Descripcion:
          "Para crear una tarea, haga clic en el botón 'Añadir tarea' en la parte inferior de la columna. Luego, escriba el nombre de la tarea y presione Enter.",
      },
      {
        id: 3,
        title: "Mover Tareas",
        Descripcion:
          "Para mover una tarea, haga clic en la tarea y arrástrela a la columna deseada.",
      },
    ],
    Opciones: [
      {
        id: 1,
        title: "Agregar miembros al tablero",
        Descripcion:
          "Para agregar miembros al tablero, haga clic en el botón 'Agregar miembros' en la parte superior derecha de la pantalla. Luego, escriba el correo electrónico del miembro y presione Enter.",
      },
      {
        id: 2,
        title: "Poder Eliminar Tareas y Columnas",
        Descripcion:
          "Para eliminar una tarea o columna, haga clic en el icono de la papelera en la parte superior derecha de la tarea o columna.",
      },
    ],
    Mensajes: [
      {
        id: 1,
        title: "Chat en tiempo real",
        Descripcion:
          "Para chatear en tiempo real con los miembros del tablero, haga clic en el botón 'Chat' en la parte inferior derecha de la pantalla.",
      },
      {
        id: 2,
        title: "Notificaciones en tiempo real",
        Descripcion:
          "Para recibir notificaciones en tiempo real, haga clic en el botón 'Notificaciones' en la parte inferior derecha de la pantalla.",
      },
      {
        id: 3,
        title: "Comentarios IA",
        Descripcion:
          "Cuando se crea una tarea o columna nueva, la IA de ViltoApp generará automáticamente comentarios con sugerencias y consejos para mejorar la productividad.",
      },
    ],
  });

  return (
    <>
      <div className="flex items-center hover:animate-jump">
        <button
          type="button"
          onClick={openModal}
          className=" p-2 text-sm  text-white bg-gray-400 flex rounded-full"
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
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
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
                    className="text-lg font-bold leading-6 text-gray-900 justify-center items-center flex "
                  >
                    <h1
                      className={` text-xl font-bold text-center p-2 rounded-lg ${
                        darkMode
                          ? "text-white bg-gray-700"
                          : "text-black bg-white"
                      }`}
                    >
                      <span>Guia de uso para el tablero de ViltoApp</span>
                    </h1>
                  </Dialog.Title>
                  <div className="mt-2">
                    <Tab.Group>
                      <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-2">
                        {Object.keys(Ayuda).map((category) => (
                          <Tab
                            key={category}
                            className={({ selected }) => [
                              "w-full rounded-lg py-2 text-sm hover:bg-gray-300 text-center cursor-pointer transition-all duration-300 ease-in-out p-2",
                              selected
                                ? "  bg-gradient-to-r from-red-500 to-pink-500 shadow-md text-white "
                                : "text-gray-700",
                            ]}
                          >
                            {category}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        {Object.values(Ayuda).map((posts, idx) => (
                          <Tab.Panel
                            key={idx}
                            className={`rounded-xl p-3 ${
                              darkMode
                                ? "bg-gray-600 text-gray-200"
                                : "bg-white"
                            }`}
                          >
                            <ul>
                              {posts.map((post) => (
                                <li
                                  key={post.id}
                                  className={`relative rounded-md p-3 ${
                                    darkMode
                                      ? "hover:bg-gray-700"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  <h3 className="text-sm font-medium leading-5">
                                    {post.title}
                                  </h3>

                                  <ul
                                    className={`mt-1 flex space-x-1 text-xs font-normal leading-4 ${
                                      darkMode
                                        ? "text-gray-300"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    <li>{post.date}</li>
                                    <li>{post.Descripcion}</li>
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                  <div className="mt-4 items-center flex justify-center">
                    <button
                      type="button"
                      className="rounded-md px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-pink-500"
                      onClick={closeModal}
                    >
                      Entendido
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
