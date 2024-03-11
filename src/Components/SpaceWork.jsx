import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import AddColumn from "./Column";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Guia from "./Guia";
import PersonasActivas from "./PersonasActivas";
import CompartirProyecto from "./CompartirProyecto";
import ProyectosFavoritos from "./ProyectosFavoritos";
import PropTypes from "prop-types";

const SpaceWork = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await fetch(
          `http://localhost:4000/project/${projectId}`
        );
        const projectData = await projectResponse.json();
        setProject(projectData);

        const columnsResponse = await fetch(
          `http://localhost:4000/columns/${projectId}`
        );
        const columnsData = await columnsResponse.json();
        setColumns(
          columnsData.data.map((column) => ({
            id: column._id,
            title: column.name,
            taskIds: column.tasks.map((task) => task._id), // Mapea las tareas a sus IDs
            tasks: column.tasks, // Añade las tareas a la columna
          }))
        );
        console.log("Project data:", projectData);
        console.log("Columns data:", columnsData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleMenuClick = (id) => {
    setOpenMenuId(id);
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setIsOpen(false);
  };

  const handleDeleteColumn = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:4000/columns/${id}`, {
        method: "DELETE",
      });
      console.log("Response status:", response.status);
      const responseBody = await response.text();
      console.log("Response body:", responseBody);
      if (response.ok) {
        setColumns((prevColumns) =>
          prevColumns.filter((column) => column.id !== id)
        );

        toast.success("Columna eliminada", { autoClose: 3000 });
      } else {
        toast.error("Error al eliminar la columna", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const onColumnCreated = (newColumn) => {
    setColumns((prevColumns) => [
      ...prevColumns,
      {
        id: newColumn._id,
        title: newColumn.name,
        taskIds: [],
      },
    ]);
  };

  //para mostrar las tareas sin recagar las pagina
  const onTaskCreated = (newTask, columnId) => {
    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
            taskIds: [...column.taskIds, newTask._id],
          };
        } else {
          return column;
        }
      });
    });
  };

  return (
    <>
      <div className="flex py-10 md:px-20 px-8 justify-between mt-5">
        <div className="flex rounded-md ">
          <div className="flex items-center justify-center m-1">
            <h1 className=" text-xl text-center p-2 bg-white rounded-md border animate-jump-in">
              {project?.name}
            </h1>
            <ProyectosFavoritos />
          </div>
          <div className="flex items-center ml-4 ">
            <PersonasActivas />
          </div>
        </div>
        <div className="flex items-center justify-center m-1">
          <CompartirProyecto />
          <Guia />
        </div>
      </div>
      <div className="flex justify-center items-center flex-wrap">
        <div className="overflow-y-auto max-h-[450px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 mx-auto">
            <DragDropContext enableDefaultBehaviour>
              {Object.values(columns).map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={(ref) => {
                        provided.innerRef(ref);
                      }}
                      className={`bg-gray-100 rounded-md border-2 p-5 w-80 h-full ${
                        snapshot.isDraggingOver
                          ? "bg-gradient-to-r from-red-400 to-pink-400"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h2 className="text-lg font-semibold mb-4 animate-fade-left">
                          {column.title}
                        </h2>
                        <div className="flex items-center text-center">
                          {isOpen && openMenuId === column ? (
                            <button
                              className="text-gray-400 mb-2 animate-jump-in"
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
                              className="text-gray-400 mb-2 animate-jump-in"
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
                              onClick={() => handleDeleteColumn(column.id)}
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
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                  className={`bg-white p-2 m-2 rounded-md border-2 shadow-sm overflow-hidden break-words`}
                                >
                                  {taskId === "add-task" ? (
                                    <Task columnId={column.id} />
                                  ) : (
                                    column.tasks.find(
                                      (task) => task._id === taskId
                                    ).name
                                  )}
                                </div>
                              );
                            }}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                      <Task
                        columnId={column.id}
                        onTaskCreated={onTaskCreated}
                      />
                    </div>
                  )}
                </Droppable>
              ))}
              <AddColumn
                projectId={projectId}
                onColumnCreated={onColumnCreated}
              />
            </DragDropContext>
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
      />
    </>
  );
};

SpaceWork.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default SpaceWork;
