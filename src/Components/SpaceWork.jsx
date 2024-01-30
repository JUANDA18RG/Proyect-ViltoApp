import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import NavbarPage from "../Home/NavbarPage";
import Task from "./Task";
import Opciones from "./OpcionesColumn";

const initialTasks = [
  { id: "1", content: "Take out the garbage", column: "column-1" },
  { id: "2", content: "Watch my favorite show", column: "column-1" },
  { id: "3", content: "Charge my phone", column: "column-2" },
  { id: "4", content: "Cook dinner", column: "column-3" },
];

const initialColumns = {
  "column-1": {
    id: "column-1",
    title: "To do",
    taskIds: ["1", "2"],
  },
  "column-2": {
    id: "column-2",
    title: "In progress",
    taskIds: ["3"],
  },
  "column-3": {
    id: "column-3",
    title: "Done",
    taskIds: ["4"],
  },
};

const SpaceWork = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

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

  const handleAddTask = (newTaskText) => {
    const columnId = "column-1";

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
  };

  const handleShowAddColumn = () => {
    setShowAddColumn(true);
  };

  const handleConfirmAddColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnTitle || `New Column ${Object.keys(columns).length + 1}`,
      taskIds: [],
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      [newColumnId]: newColumn,
    }));

    setNewColumnTitle("");
    setShowAddColumn(false);
  };

  return (
    <>
      <NavbarPage />
      <div className="flex justify-center items-center">
        <div className="grid md:grid-cols-4 gap-4 p-8 mx-auto m-2">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-gray-100 rounded-md p-4 w-72 m-5 ${
                      snapshot.isDraggingOver
                        ? "bg-gradient-to-r from-red-400 to-pink-400 transition duration-300"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-4">
                        {column.title}
                      </h2>
                      <Opciones />
                    </div>
                    {column.taskIds.map((taskId, index) => (
                      <Draggable
                        key={taskId}
                        draggableId={taskId}
                        index={index}
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
                            className="bg-white p-2 mb-2 rounded-md border"
                          >
                            {tasks.find((task) => task.id === taskId)?.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {column.id === "column-1" && (
                      <Task onAddTask={handleAddTask} />
                    )}
                  </div>
                )}
              </Droppable>
            ))}
            <div className="flex items-center justify-center">
              {showAddColumn ? (
                <div
                  className="flex items-center justify-between"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setShowAddColumn(false);
                    }
                  }}
                >
                  <textarea
                    type="text"
                    rows="1"
                    cols="30"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Ingrese la nueva Columna"
                    className="p-2 rounded-md resize-none flex-grow border-2 border-gray-300"
                  />
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-md ml-2"
                    onClick={handleConfirmAddColumn}
                  >
                    {" "}
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
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="bg-gray-300 text-center items-center p-2 rounded-md flex text-gray-600 text-sm"
                  onClick={handleShowAddColumn}
                >
                  Agregar Columna
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              )}
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default SpaceWork;
