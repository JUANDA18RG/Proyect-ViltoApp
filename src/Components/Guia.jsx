import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(false);

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
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Opciones: [
      {
        id: 1,
        title: "Las opciones de  ViltoApp",
        Descripcion:
          "1. Crear Tareas  2. Crear Columnas de eventos 3. poder mover las tareas 4. poedr eliminar columnas o tareas 5. poder hacer todo esto con tu grupo de trabajp",
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
    Ajustes: [
      {
        id: 1,
        title: "Ask Me Anything: 10 answers to your questions about coffee",
        date: "2d ago",
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: "4d ago",
        commentCount: 1,
        shareCount: 2,
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-t from-gray-300 to-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900  mb-4 text-center"
                  >
                    Esta es la guia de uso para el sistema de uso de ViltoApp
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
                            className={"rounded-xl bg-white p-3"}
                          >
                            <ul>
                              {posts.map((post) => (
                                <li
                                  key={post.id}
                                  className="relative rounded-md p-3 hover:bg-gray-100"
                                >
                                  <h3 className="text-sm font-medium leading-5">
                                    {post.title}
                                  </h3>

                                  <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
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
