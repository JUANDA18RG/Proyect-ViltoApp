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
    Use: [
      {
        id: 1,
        title: "Create Columns",
        Descripcion:
          "To create a column, click the 'Add Column' button on the right side of the screen. Then, type the column name and press Enter.",
      },
      {
        id: 2,
        title: "Create Tasks",
        Descripcion:
          "To create a task, click the 'Add Task' button at the bottom of the column. Then, type the name of the task and press Enter.",
      },
      {
        id: 3,
        title: "Move Tasks",
        Descripcion:
          "To move a task, click on the task and drag it to the desired column.",
      },
    ],
    Options: [
      {
        id: 1,
        title: "Add members to the board",
        Descripcion:
          "To add members to the board, click the 'Add Members' button at the top right of the screen. Then, type the member's email and press Enter.",
      },
      {
        id: 2,
        title: "Being able to Delete Tasks and Columns",
        Descripcion:
          "To delete a task or column, click the trash icon at the top right of the task or column.",
      },
    ],
    Messages: [
      {
        id: 1,
        title: "Real-time chat",
        Descripcion:
          "To chat in real time with board members, click the 'Chat' button at the bottom right of the screen.",
      },
      {
        id: 2,
        title: "Real-time notifications",
        Descripcion:
          "To receive real-time notifications, click the 'Notifications' button at the bottom right of the screen.",
      },
      {
        id: 3,
        title: "IA Comments",
        Descripcion:
          "When a new task or column is created, ViltoApp's AI will automatically generate comments with suggestions and tips to improve productivity.",
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
                      <span>User guide for the ViltoApp dashboard</span>
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
                      Ok I got it!
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
