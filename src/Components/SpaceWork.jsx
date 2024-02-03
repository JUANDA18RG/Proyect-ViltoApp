// SpaceWork.js
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import Opciones from "./OpcionesColumn";
import AddColumn from "./Column";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="flex justify-center items-center flex-wrap overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 mx-auto">
          <DragDropContext onDragEnd={onDragEnd} enableDefaultBehaviour>
            {Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-gray-100 rounded-md border-2 p-5 w-80 h-full   ${
                      snapshot.isDraggingOver
                        ? "bg-gradient-to-r from-red-400 to-pink-400 transition duration-300 ease-in-out"
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
                            className={`bg-white p-2 m-2 rounded-md border-2 shadow-sm`}
                          >
                            {tasks.find((task) => task.id === taskId)?.content}
                          </div>
                        )}
                      </Draggable>
                    ))}

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

      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={3000}
        closeOnClick={false}
        pauseOnHover={true}
        draggablePercent={100}
        bodyClassName={"text-sm p-2 m-1 "}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "20px",
          zIndex: 9999,
        }}
        toastClassName="overflow-visible"
      />
    </>
  );
};

export default SpaceWork;
