import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import io from "socket.io-client";

export default function EditarTarea({ task, columnId }) {
  const BorrarTarea = () => {
    console.log("Borrando tarea:", task._id);
    console.log("Columna:", columnId);
    const socket = io("http://localhost:3000");
    socket.emit(
      "borrarTarea",
      { taskId: task._id, columnId: columnId },
      (response) => {
        if (response.success) {
          console.log(`La tarea con ID ${response.data} ha sido borrada.`);
        } else {
          console.error("Error al borrar la tarea:", response.error);
        }
      }
    );
  };

  return (
    <Menu as="nav" className="relative z-50">
      <Menu.Button className="opacity-0 group-hover:opacity-100 ml-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-1 text-white transition-all duration-500 ease-in-out">
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
      </Menu.Button>
      <Menu.Items
        className={
          "absolute p-2 top-0 left-20 w-32 bg-active rounded-md translate-y-2 border-2 border-red-400 shadow-sm bg-gradient-to-b from-gray-100 to-white md:text-sm animate-jump-in "
        }
      >
        <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out my-1">
          {({ active }) => (
            <button
              className={`flex items-center justify-center w-full h-10 rounded-md${
                active && "bg-white text-white"
              }`}
            >
              Editar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </button>
          )}
        </Menu.Item>
        <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out my-1">
          {({ active }) => (
            <button
              className={`flex items-center justify-center w-full h-10 rounded-md${
                active && "bg-white text-white"
              }`}
              onClick={BorrarTarea}
            >
              Borrar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </Menu.Item>
        <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out my-1">
          {({ active }) => (
            <button
              className={`flex items-center justify-center w-full h-10 rounded-md${
                active && "bg-white text-white"
              }`}
            >
              Asignar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

EditarTarea.propTypes = {
  task: PropTypes.object,
  columnId: PropTypes.string,
};
