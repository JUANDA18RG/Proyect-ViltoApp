import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";
import GuiaInicio from "../Components/GuiaInicio";
import { useAuth } from "../context/authContext";

export default function Works() {
  const [works, setWorks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const handleMenuClick = (id) => {
    setOpenMenuId(id);
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const auth = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (auth.user) {
        const email = auth.user.email;
        const response = await fetch(`http://localhost:4000/projects/${email}`);
        const data = await response.json();
        setWorks(data);
        console.log(data);
      }
    };

    fetchProjects();
  }, [auth.user]);

  const deleteProject = async (id) => {
    const response = await fetch(`http://localhost:4000/projects/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    const newWorks = works.filter((work) => work._id !== id);
    setWorks(newWorks);
  };

  return (
    <div className="w-4/5 h-screen overflow-y-auto mt-8 pb-20">
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
              {[...works].reverse().map((work) => (
                <div
                  key={work._id}
                  className="relative flex flex-col items-center justify-center w-64 h-60 m-5 rounded-lg bg-gray-100 animate-jump-in"
                >
                  <div className="absolute top-2 right-2 m-2">
                    <div className="flex items-center text-center">
                      {isOpen && openMenuId === work._id ? (
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
  );
}
