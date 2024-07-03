"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ToDoProps {
  id: number;
  title: string;
  completed: boolean;
}

export default function ToDo() {
  const [toDos, setToDos] = useState<ToDoProps[]>([]);
  const [newToDo, setNewToDo] = useState("");
  const [editingId, setEditingId] = useState<number | null>();
  const [editingTitle, setEditingTitle] = useState("");

  const handleToggleComplete = (id: number) => {
    setToDos(
      toDos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleUpdateToDo = (id: number) => {
    setToDos(
      toDos.map((todo) =>
        todo.id === id ? { ...todo, title: editingTitle } : todo
      )
    );
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditTodo = (id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleAddToDo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newToDo.trim()) {
      const newTask: ToDoProps = {
        id: Date.now(),
        title: newToDo,
        completed: false,
      };
      // Add a task to the list
      setToDos([...toDos, newTask]);
      setNewToDo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    setToDos(toDos.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    // Fetch todos from a dummy api
    axios
      .get("https://jsonplaceholder.typicode.com/todos?_limit=20")
      .then((response) => setToDos(response.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto border-[2px] shadow-lg">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <form className="flex mb-4 gap-2" onSubmit={handleAddToDo}>
        <input
          type="text"
          placeholder="What Task do you have today?"
          className="flex-grow p-2 border border-gray-300 rounded outline-none"
          value={newToDo}
          onChange={(e) => setNewToDo(e.target.value)}
        />
        <button
          className=" bg-blue-500 text-white rounded p-2 cursor-pointer"
          //   onClick={handleAddToDo}
        >
          Add Task
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {toDos.map((todo) => (
          <li
            key={todo.id}
            className={`flex justify-between items-center p-2 border border-gray-500 rounded ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {editingId === todo.id ? (
              <input
                type="text"
                className=" flex-grow p-2 border border-gray-300 rounded"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />
            ) : (
              <span
                className="flex-grow cursor-pointer"
                onClick={() => handleToggleComplete(todo.id)}
              >
                {todo.title}
              </span>
            )}

            {editingId === todo.id ? (
              <button
                className="ml-2 p-2 bg-green-500 text-white rounded"
                onClick={() => handleUpdateToDo(todo.id)}
              >
                update
              </button>
            ) : (
              <button
                className="ml-2 p-2 bg-yellow-500 text-white rounded"
                onClick={() => handleEditTodo(todo.id, todo.title)}
              >
                Edit
              </button>
            )}

            <button
              className="ml-2 p-2 bg-red-500 text-white rounded"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
