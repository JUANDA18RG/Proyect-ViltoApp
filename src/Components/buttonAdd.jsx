import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAuth } from "../context/authContext";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ButtonAdd({ setWorks }) {
  let [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const auth = useAuth();

  const handleSubmit = async () => {
    const userEmail = auth.user.email;

    const project = {
      name,
      description,
      users: [{ email: userEmail }],
    };

    const response = await fetch("http://localhost:4000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    const data = await response.json();

    // Actualiza el estado de works para incluir el nuevo proyecto
    setWorks((prevWorks) => [...prevWorks, data]);
    toast.success(`La tarea de nombre ${name} fue creada.`, {
      autoClose: 3000,
    });

    console.log(data);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-1 text-white hover:animate-jump">
        <button
          onClick={openModal}
          className="relative flex items-center justify-center space-x-2 md:space-x-2 p-1 w-full"
        >
          <span className="hidden md:inline text-sm md:text-sm">
            Agregar Proyecto
          </span>
          <div className="md:flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
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
            <div className="fixed inset-0 bg-black/40" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 justify-center items-center flex m-2"
                  >
                    <h1 className="uppercase border-b-2 border-red-500 text-xl text-center">
                      Crea tu proyecto 😃💯❤️
                    </h1>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 text-justify">
                      Crea un proyecto para trabajar en equipo, comparte
                      archivos, ideas y mucho más con tus compañeros de trabajo
                      y amigos.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-center text-center">
                    <input
                      id="projectTitle"
                      type="text"
                      className="p-2 w-full border rounded-lg bg-gray-100 border-gray-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50 m-2"
                      placeholder="Nombre del Proyecto 👏"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-center text-center">
                    <input
                      id="projectDescription"
                      type="text"
                      className="p-2 w-full border rounded-lg bg-gray-100 border-gray-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50 m-2"
                      placeholder="Descripcion del Proyecto 🤌"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mt-6 items-center justify-center text-center ">
                    <button
                      type="button"
                      className="inline-flex justify-center bg-gradient-to-r from-red-500 to-pink-500 shadow-md text-white rounded-md p-2"
                      onClick={async () => {
                        await handleSubmit();
                        closeModal();
                      }}
                    >
                      Crear
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick={false}
        pauseOnHover={true}
        draggablePercent={100}
        bodyClassName={"text-sm p-2 m-2 "}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "20px",
          zIndex: 20,
        }}
        toastClassName="overflow-visible"
      />
    </>
  );
}

ButtonAdd.propTypes = {
  setWorks: PropTypes.func.isRequired,
};
