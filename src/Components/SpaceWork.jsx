// SpaceWork.js
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import NavbarPage from "../Home/NavbarPage";
import Task from "./Task"; // Importar el componente Task

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
    const columnId = "column-1"; // Agregar tarea solo en la primera columna

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

  return (
    <>
      <NavbarPage />
      <div className="flex justify-center items-center">
        <div className="grid md:grid-cols-3 gap-4 p-8 mx-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 rounded-md p-4 w-72 m-5"
                  >
                    <h2 className="text-lg font-semibold mb-4">
                      {column.title}
                    </h2>
                    {column.taskIds.map((taskId, index) => (
                      <Draggable
                        key={taskId}
                        draggableId={taskId}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded-md border"
                          >
                            {tasks.find((task) => task.id === taskId)?.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {column.id === "column-1" && (
                      <Task onAddTask={handleAddTask} />
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default SpaceWork;
