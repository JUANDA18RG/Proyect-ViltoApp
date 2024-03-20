import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";
import GuiaInicio from "../Components/GuiaInicio";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "../App";

export default function Works() {
  const [works, setWorks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();

  const handleMenuClick = (id) => {
    setOpenMenuId(id);
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setIsOpen(false);
  };

  const auth = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      if (auth.user) {
        const email = auth.user.email;
        const response = await fetch(`http://localhost:4000/projects/${email}`);
        const data = await response.json();
        setWorks(data);
        console.log(data);
      }
      setIsLoading(false);
    };

    fetchProjects();

    socket.on("proyect created", (newProject) => {
      // Actualiza el estado de works para incluir el nuevo proyecto
      setWorks((prevWorks) => [...prevWorks, newProject]);
    });

    // Asegúrate de limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off("proyect created");
    };
  }, [socket, auth.user]);

  const deleteProject = async (id) => {
    const response = await fetch(`http://localhost:4000/projects/${id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      toast.warning("El proyecto fue eliminado", {
        autoClose: 3000,
      });
      setWorks((prevWorks) => prevWorks.filter((work) => work._id !== id));
    }
  };

  return (
    <>
      <div className="w-4/5 h-screen overflow-y-auto mt-8 pb-20 ">
        <div className="flex flex-col px-4 md:px-20">
          <div className="flex py-8 md:px-14 px-10 text-sm md:text-xl justify-between">
            <div className="flex m-2">
              <ButtonAdd setWorks={setWorks} />
            </div>
            <GuiaInicio />
          </div>
          <div className="text-center mt-2">
            <div className="text-center w-full">
              <div className="flex flex-wrap justify-center  items-center m-5 gap-x-10 ">
                {isLoading && (
                  <div className="flex justify-center items-center w-full h-full mt-32">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-300 fill-red-500"
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
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                {works.length === 0 && !isLoading && (
                  <div className="flex justify-center items-center h-full opacity-70 py-48">
                    <p className="text-xl text-gray-500">
                      No hay proyectos existentes.
                    </p>
                  </div>
                )}

                {[...works].reverse().map((work) => (
                  <div
                    key={work._id}
                    className="relative flex flex-col items-center justify-center w-64 h-60 m-5 rounded-lg bg-gray-100  animate-jump-in"
                  >
                    <div className="absolute top-2 right-2 m-2">
                      <div className="flex items-center text-center">
                        {isOpen && openMenuId === work._id ? (
                          <button
                            className="text-gray-400 mb-2 animate-jump-in"
                            onClick={() => handleCloseMenu()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="text-gray-400 mb-2 animate-jump-in"
                            onClick={() => handleMenuClick(work._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    {isOpen && openMenuId === work._id ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col items-center space-y-2">
                          <button className="flex items-center p-2 m-1 bg-blue-500 rounded-md text-white animate-jump-in">
                            <span className="text-sm">Edit</span>
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteProject(work._id)}
                            className="flex items-center  p-2 m-1 bg-red-500 rounded-md text-white animate-jump-in"
                          >
                            <span className="text-sm">Delete</span>
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
                        </div>
                      </div>
                    ) : (
                      <Link to={`/AreaTrabajo/${work._id}`}>
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <h1 className="text-lg font-bold">{work.name}</h1>
                          <p className="text-sm">{work.description}</p>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
