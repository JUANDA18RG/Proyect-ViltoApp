import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import AddColumn from "./Column";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Guia from "./Guia";
import CompartirProyecto from "./CompartirProyecto";
import ProyectosFavoritos from "./ProyectosFavoritos";
import PropTypes from "prop-types";
import io from "socket.io-client";
import ButtonChat from "../Chat/ButtonChat";
import { useAuth } from "../context/authContext";
import PersonasActivas from "./PersonasActivas";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LinksProyect from "./LinksProyect";

const SpaceWork = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [CargaSkeleton, setCargaSkeleton] = useState(true);
  const [respuestaIA, setRespuestaIA] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [taskCreated, setTaskCreated] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargaSkeleton(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (socket) {
      const handleRespuestaIA = (data) => {
        console.log("respuesta de la IA", data);
        setTimeout(() => {
          setRespuestaIA(data);
          setDialogContent(data);
          setLoading(false);
          setShowDialog(true);
        }, 200);
      };

      const handleProyecto = async (projectData) => {
        setProject(projectData);

        const columnsData = await new Promise((resolve, reject) => {
          socket.emit("obtenerColumnas", projectId, (data) => {
            if (data.success) {
              resolve(data.data);
            } else {
              reject(data.error);
            }
          });
        });
        const updatedColumns = columnsData.map((column) => ({
          id: column._id,
          title: column.name,
          taskIds: column.tasks.map((task) => task._id),
          tasks: column.tasks,
        }));

        setColumns(updatedColumns);
      };

      const handleColumnaCreada = (column) => {
        setColumns((prevColumns) => [
          ...prevColumns,
          {
            id: column._id,
            title: column.name,
            taskIds: column.tasks.map((task) => task._id),
            tasks: column.tasks,
          },
        ]);
        toast.success(`Columna ${column.name} creada con éxito`, {
          autoClose: 3000,
        });
        const data = {
          metodo: "columnaCreada",
          task: "",
          column: column.name,
          projectName: project?.name,
          projectDescription: project?.description,
        };
        setLoading(true);
        console.log("informacion enviada a la IA", data);
        socket.emit("obtenerRespuestaIA", data);
      };

      const handleColumnaEliminada = (id) => {
        setColumns((prevColumns) =>
          prevColumns.filter((column) => column.id !== id)
        );
        toast.success(`Columna eliminada con éxito`, { autoClose: 3000 });
      };

      const handleTareaCreada = (newTask) => {
        setColumns((prevColumns) => {
          const data = {
            metodo: "tareaCreada",
            task: newTask.task.name,
            column: newTask.column.name,
            projectName: project?.name,
            projectDescription: project?.description,
          };

          setTaskData(data);
          setTaskCreated(true);
          const columnIndex = prevColumns.findIndex(
            (column) => column.id === newTask.columnId
          );

          if (columnIndex !== -1) {
            const newColumns = [...prevColumns];
            newColumns[columnIndex].tasks.push(newTask);
            return newColumns;
          }

          return prevColumns;
        });

        // Añadir un flag para prevenir múltiples notificaciones
        if (!newTask.notificationShown) {
          toast.success(`Tarea Creada con éxito`, { autoClose: 3000 });
          newTask.notificationShown = true;
        }
        setShowDialog(true);
        setForceUpdate((prev) => !prev);
      };

      const handleTareaMovida = (data) => {
        setColumns((prevColumns) => {
          const sourceColumnIndex = prevColumns.findIndex(
            (column) => column.id === data.sourceColumnId
          );
          const destinationColumnIndex = prevColumns.findIndex(
            (column) => column.id === data.destinationColumnId
          );

          if (sourceColumnIndex !== -1 && destinationColumnIndex !== -1) {
            const newColumns = [...prevColumns];
            const movedTask = newColumns[sourceColumnIndex].tasks.find(
              (task) => task._id === data.taskId
            );

            if (movedTask) {
              newColumns[sourceColumnIndex].tasks = newColumns[
                sourceColumnIndex
              ].tasks.filter((task) => task._id !== data.taskId);
              newColumns[destinationColumnIndex].tasks.splice(
                data.destinationIndex,
                0,
                movedTask
              );
            }

            return newColumns;
          }

          return prevColumns;
        });

        toast.success(`Tarea Movida con éxito`, { autoClose: 3000 });
        setForceUpdate((prev) => !prev);
      };

      const handleTareaEliminada = (data) => {
        setColumns((prevColumns) => {
          return prevColumns.map((column) => {
            if (column.id === data.columnId) {
              return {
                ...column,
                taskIds: column.taskIds.filter((id) => id !== data.taskId),
                tasks: column.tasks.filter((task) => task._id !== data.taskId),
              };
            } else {
              return column;
            }
          });
        });

        toast.success(`Tarea eliminada con éxito`, { autoClose: 3000 });
      };

      socket.on("respuestaIA", handleRespuestaIA);
      socket.emit("obtenerProyecto", projectId);
      socket.on("proyecto", handleProyecto);
      socket.on("columnaCreada", handleColumnaCreada);
      socket.on("columnaEliminada", handleColumnaEliminada);
      socket.on("tareaCreada", handleTareaCreada);
      socket.on("tareaMovida", handleTareaMovida);
      socket.emit("esFavorito", projectId);
      socket.on("tareaEliminada", handleTareaEliminada);

      return () => {
        socket.off("respuestaIA", handleRespuestaIA);
        socket.off("proyecto", handleProyecto);
        socket.off("columnaCreada", handleColumnaCreada);
        socket.off("columnaEliminada", handleColumnaEliminada);
        socket.off("tareaCreada", handleTareaCreada);
        socket.off("tareaMovida", handleTareaMovida);
        socket.off("tareaEliminada", handleTareaEliminada);
        socket.off("esFavorito");
      };
    }
  }, [projectId, forceUpdate, project?.name, project?.description, socket]);

  useEffect(() => {
    if (socket && taskCreated) {
      console.log("información enviada a la IA", taskData);
      setLoading(true);
      socket.emit("obtenerRespuestaIA", taskData);
      setTaskCreated(false);
    }
  }, [socket, taskCreated, taskData]);

  const handleDeleteTask = async (taskId, columnId) => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit(
      "eliminarTarea",
      { taskId, columnId, userEmail: user.email, projectId },
      (response) => {
        if (!response.success) {
          toast.error("Error al eliminar la tarea", { autoClose: 3000 });
        } else {
          // Actualizar el estado de la columna después de eliminar la tarea
          setColumns((prevColumns) => {
            return prevColumns.map((column) => {
              if (column.id === columnId) {
                // Filtra los taskIds para eliminar el taskId dado
                return {
                  ...column,
                  taskIds: column.taskIds.filter((id) => id !== taskId),
                };
              } else {
                return column;
              }
            });
          });
        }
      }
    );
  };

  const handleMenuClick = (id) => {
    setOpenMenuId(id);
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setIsOpen(false);
  };

  const handleDeleteColumn = async (id) => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit(
      "eliminarColumna",
      { id, userEmail: user.email, projectId },
      (response) => {
        if (!response.success) {
          toast.error("Error al eliminar la columna", { autoClose: 3000 });
        }
      }
    );
  };

  const onDragEnd = (result) => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.find((column) => column.id === source.droppableId);
    const finish = columns.find(
      (column) => column.id === destination.droppableId
    );

    if (!start || !finish) {
      return;
    }

    setColumns((prevColumns) => {
      let newColumns = [...prevColumns];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...start,
          taskIds: newTaskIds,
        };
        newColumns = newColumns.map((column) =>
          column.id === newColumn.id ? newColumn : column
        );
      } else {
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
          ...start,
          taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
          ...finish,
          taskIds: finishTaskIds,
        };

        newColumns = newColumns.map((column) =>
          column.id === newStart.id
            ? newStart
            : column.id === newFinish.id
            ? newFinish
            : column
        );
      }

      socket.emit("moverTarea", {
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        userEmail: user.email,
        projectId,
      });

      return newColumns;
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-bottom bg-no-repeat bg-cover transform rotate-180 opacity-60"
        style={{ backgroundImage: `url('/assets/wavesOpacity.svg')` }}
      ></div>
      <div className="relative">
        <div className="flex py-10 md:px-20 px-8 justify-between mt-5 ">
          <div className="flex rounded-md">
            <div className="flex items-center justify-center m-2">
              {CargaSkeleton ? (
                <SkeletonTheme
                  baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                  highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                >
                  <Skeleton width={100} height={40} />
                </SkeletonTheme>
              ) : (
                <h1
                  className={`text-xl text-center p-2 rounded-lg border-2 animate-jump-in shadow-sm transform transition-all duration-500 ease-in-out ${
                    darkMode ? "text-white bg-gray-700" : "text-black bg-white"
                  }`}
                >
                  {project?.name}
                </h1>
              )}
              <div className="flex items-center justify-center ml-7 space-x-5 animate-jump-in">
                <div className="flex items-center space-x-4 mr-4">
                  {CargaSkeleton ? (
                    <SkeletonTheme
                      baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                    >
                      <Skeleton circle={true} height={40} width={40} />
                    </SkeletonTheme>
                  ) : (
                    <ProyectosFavoritos projectId={projectId} />
                  )}
                  {CargaSkeleton ? (
                    <SkeletonTheme
                      baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                    >
                      <Skeleton circle={true} height={40} width={40} />
                    </SkeletonTheme>
                  ) : (
                    <ButtonChat
                      projectId={projectId}
                      projectName={project?.name}
                    />
                  )}
                  {CargaSkeleton ? (
                    <SkeletonTheme
                      baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                    >
                      <Skeleton circle={true} height={40} width={40} />
                    </SkeletonTheme>
                  ) : (
                    <LinksProyect projectId={projectId} />
                  )}
                </div>

                <div className="flex  items-center space-x-2 animate-jump-in">
                  {CargaSkeleton ? (
                    <SkeletonTheme
                      baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                    >
                      <Skeleton width={120} height={40} radius={50} />
                    </SkeletonTheme>
                  ) : (
                    <PersonasActivas projectId={projectId} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center m-2 space-x-7 animate-jump-in">
            {CargaSkeleton ? (
              <SkeletonTheme
                baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
              >
                <Skeleton width={80} height={30} radius={50} />
              </SkeletonTheme>
            ) : (
              <CompartirProyecto projectId={projectId} />
            )}
            {CargaSkeleton ? (
              <SkeletonTheme
                baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
              >
                <Skeleton circle={true} height={40} width={40} />
              </SkeletonTheme>
            ) : (
              <Guia />
            )}
          </div>
        </div>
        <div className="flex justify-center items-center flex-wrap">
          <div className="overflow-y-auto max-h-[450px] overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 mx-auto ">
              <DragDropContext onDragEnd={onDragEnd} enableDefaultBehaviour>
                {CargaSkeleton
                  ? Array.from({ length: Object.keys(columns).length }).map(
                      (_, index) => (
                        <SkeletonTheme
                          baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
                          highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
                          key={index}
                        >
                          <Skeleton width={320} height={300} radius={25} />
                        </SkeletonTheme>
                      )
                    )
                  : Object.values(columns).map((column) => (
                      <Droppable key={column.id} droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`rounded-md border-2 p-5 w-80 h-full  ${
                              snapshot.isDraggingOver
                                ? "bg-gradient-to-r from-red-400 to-pink-400"
                                : darkMode
                                ? "bg-gray-600"
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between">
                              <h2
                                className={`text-lg font-semibold mb-4 animate-fade-left transform transition-all duration-500 ease-in-out ${
                                  darkMode ? "text-white" : "text-black"
                                }`}
                              >
                                {column.title}
                              </h2>
                              <div className="flex items-center text-center">
                                {isOpen && openMenuId === column ? (
                                  <button
                                    className={`text-gray-400 mb-2 animate-jump-in ${
                                      darkMode ? "text-white" : "text-gray-800"
                                    }`}
                                    onClick={handleCloseMenu}
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
                                    className={`text-gray-400 mb-2 animate-jump-in transform transition-all duration-500 ease-in-out ${
                                      darkMode ? "text-white" : "text-gray-800"
                                    }`}
                                    onClick={() => handleMenuClick(column)}
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
                            {openMenuId === column ? (
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
                                    onClick={() =>
                                      handleDeleteColumn(column.id)
                                    }
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
                              column.taskIds.map((taskId, index) => (
                                <Draggable
                                  key={taskId}
                                  draggableId={taskId}
                                  index={index}
                                  isDragDisabled={openMenuId === column.id}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: snapshot.isDragging
                                            ? 0.8
                                            : 1,
                                        }}
                                        className={`flex justify-between items-center p-2 m-2 rounded-md border-2 shadow-sm overflow-visible group ${
                                          darkMode
                                            ? "bg-gray-800 text-white"
                                            : "bg-white text-black"
                                        }`}
                                      >
                                        {CargaSkeleton ? (
                                          <SkeletonTheme
                                            baseColor={
                                              darkMode ? "#3D4451" : "#D0D0D0"
                                            }
                                            highlightColor={
                                              darkMode ? "#5A6270" : "#C0C0C0"
                                            }
                                          >
                                            <Skeleton
                                              width={50}
                                              height={50}
                                              radius={25}
                                            />
                                          </SkeletonTheme>
                                        ) : (
                                          (() => {
                                            const task = column.tasks.find(
                                              (task) => task._id === taskId
                                            );
                                            return (
                                              <>
                                                <div className="flex-grow min-w-0 break-words">
                                                  <p>{task && task.name}</p>
                                                </div>
                                                <button
                                                  onClick={() =>
                                                    handleDeleteTask(
                                                      taskId,
                                                      column.id
                                                    )
                                                  }
                                                  className="opacity-0 group-hover:opacity-100 ml-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-1 text-white transition-all duration-500 ease-in-out"
                                                >
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
                                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                  </svg>
                                                </button>
                                              </>
                                            );
                                          })()
                                        )}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                            <Task columnId={column.id} projectId={projectId} />
                          </div>
                        )}
                      </Droppable>
                    ))}
                {columns.length === 0 ? (
                  <div className="flex justify-center items-center w-screen mt-10">
                    <div className="relative inset-2 flex flex-col justify-center items-center pointer-events-none">
                      {CargaSkeleton ? (
                        <SkeletonTheme
                          baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
                          highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
                        >
                          <Skeleton width={200} height={50} radius={25} />
                        </SkeletonTheme>
                      ) : (
                        <>
                          <span className="text-gray-400 text-lg mb-1 pointer-events-auto flex">
                            No hay columnas para mostrar en este proyecto
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 ml-2 items-center"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                              />
                            </svg>
                          </span>
                          <AddColumn projectId={projectId} />
                        </>
                      )}
                    </div>
                  </div>
                ) : CargaSkeleton ? (
                  <div className="flex justify-center items-center h-full">
                    <SkeletonTheme
                      baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
                      highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
                    >
                      <Skeleton width={150} height={40} radius={25} />
                    </SkeletonTheme>
                  </div>
                ) : (
                  <AddColumn projectId={projectId} />
                )}
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick={false}
        pauseOnHover={true}
        draggablePercent={100}
        bodyClassName={"text-sm p-2 m-2 "}
        style={{ width: "300px" }}
        theme={darkMode ? "dark" : "light"}
      />
      <div
        className="fixed bottom-5 left-10"
        onMouseEnter={() => respuestaIA && setShowDialog(true)}
      >
        {CargaSkeleton ? (
          <SkeletonTheme
            baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
            highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
          >
            <Skeleton circle={true} height={70} width={70} />
          </SkeletonTheme>
        ) : (
          <div
            className={`w-20 h-20 overflow-hidden rounded-full flex items-center justify-center border-2 ${
              darkMode ? "border-gray-800 border-4" : "border-gray-400 border-4"
            }`}
          >
            <img
              src="/assets/Robot.gif"
              className="w-full h-full"
              alt="Ayudante robot"
            />
          </div>
        )}
      </div>
      {showDialog && (
        <div
          className={`fixed bottom-24 left-24 p-2 ml-4 overflow-y-auto rounded-md shadow-lg text-justify transition-all duration-100 ease-in-out transform ${
            loading ? "w-12 h-12 " : "w-60 h-40"
          } ${
            darkMode
              ? "text-white bg-gray-600 border-4 border-gray-800"
              : "text-gray-600 bg-gray-100 border-4 border-gray-400"
          }`}
          onMouseLeave={() => setShowDialog(false)}
        >
          <p className="text-center">{loading ? "..." : dialogContent}</p>
        </div>
      )}
    </>
  );
};

SpaceWork.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default SpaceWork;
