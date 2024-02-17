import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import AddColumn from "./Column";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Guia from "./Guia";

const initialTasks = [
  { id: "1", content: "Take out the garbage", column: "column-1" },
  { id: "2", content: "Watch my favorite show", column: "column-1" },
  { id: "3", content: "Charge my phone", column: "column-2" },
  { id: "4", content: "Cook dinner", column: "column-3" },
];

const initialColumns = {
  "column-1": {
    id: "column-1",
    title: "To do 😀😇",
    taskIds: ["1", "2"],
  },
  "column-2": {
    id: "column-2",
    title: "In progress 💪💥",
    taskIds: ["3"],
  },
  "column-3": {
    id: "column-3",
    title: "Done ❤️💯💢",
    taskIds: ["4"],
  },
};

const SpaceWork = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuRef, setMenuRef] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      const columnId = source.droppableId;
      const updatedTasks = [...columns[columnId].taskIds];
      updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, draggableId);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [columnId]: {
          ...prevColumns[columnId],
          taskIds: updatedTasks,
        },
      }));
    } else {
      toast.info(
        `La tarea fue movida a la columna ${destination.droppableId}`,
        { autoClose: 3000 }
      );
      const sourceColumnId = source.droppableId;
      const destinationColumnId = destination.droppableId;

      const updatedTasks = tasks.map((task) => {
        if (task.id === draggableId) {
          return {
            ...task,
            column: destinationColumnId,
          };
        }
        return task;
      });

      setTasks(updatedTasks);

      const updatedColumns = {
        ...columns,
        [sourceColumnId]: {
          ...columns[sourceColumnId],
          taskIds: columns[sourceColumnId].taskIds.filter(
            (taskId) => taskId !== draggableId
          ),
        },
        [destinationColumnId]: {
          ...columns[destinationColumnId],
          taskIds: [...columns[destinationColumnId].taskIds, draggableId],
        },
      };

      setColumns(updatedColumns);
    }
  };
  const handleAddTask = (columnId, newTaskText) => {
    const newTask = {
      id: `new-${Date.now()}`,
      content: newTaskText,
      column: columnId,
    };

    setTasks([...tasks, newTask]);

    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: [...columns[columnId].taskIds, newTask.id],
      },
    };
    setColumns(updatedColumns);
    toast.success(`La tarea de nombre ${newTask.content} fue creada.`, {
      autoClose: 3000,
    });
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef && !menuRef.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleMenuClick = (columnId) => {
    setOpenMenuId(openMenuId === columnId ? null : columnId);
  };

  const handleConfirmAddColumn = (title) => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: title || `New Column ${Object.keys(columns).length + 1}`,
      taskIds: [],
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      [newColumnId]: newColumn,
    }));

    toast.success(`La columna de nombre ${newColumn.title} fue creada.`, {
      autoClose: 3000,
    });
  };

  return (
    <>
      <div className="m-2 py-10 md:px-20 px-8">
        <Guia />
      </div>
      <div className="flex justify-center items-center flex-wrap">
        <div className="overflow-y-auto max-h-[450px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 mx-auto">
            <DragDropContext onDragEnd={onDragEnd} enableDefaultBehaviour>
              {Object.values(columns).map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={(ref) => {
                        provided.innerRef(ref);
                        if (column.taskIds.length > 0) {
                          setMenuRef(ref);
                        }
                      }}
                      className={`bg-gray-100 rounded-md border-2 p-5 w-80 h-full ${
                        snapshot.isDraggingOver
                          ? "bg-gradient-to-r from-red-400 to-pink-400 "
                          : ""
                      }`}
                    >
                      <div className="flex justify-between ">
                        <h2 className="text-lg font-semibold mb-4 animate-fade-left">
                          {column.title}
                        </h2>
                        <button
                          className="text-gray-400 mb-2"
                          onClick={() => handleMenuClick(column.id)}
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
                      </div>
                      {openMenuId === column.id ? (
                        <div
                          ref={(ref) => setMenuRef(ref)}
                          className="flex flex-col items-center space-y-2"
                        >
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
                          <button className="flex items-center  p-2 m-1 bg-red-500 rounded-md text-white animate-jump-in">
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
                      ) : (
                        column.taskIds.map((taskId, index) => (
                          <Draggable
                            key={taskId}
                            draggableId={taskId}
                            index={index}
                            isDragDisabled={openMenuId === column.id}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                                className={`bg-white p-2 m-2 rounded-md border-2 shadow-sm`}
                              >
                                {
                                  tasks.find((task) => task.id === taskId)
                                    ?.content
                                }
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                      <Task columnId={column.id} onAddTask={handleAddTask} />
                    </div>
                  )}
                </Droppable>
              ))}
              <AddColumn onAddColumn={handleConfirmAddColumn} />
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
};

export default SpaceWork;
