import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md";
import { IoClose, IoClipboardOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

function Todo() {
  const navigate = useNavigate();

  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState("all");

  const API_URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const res = await axios.get(`${API_URL}/todos`, authConfig);
        setTodos(res.data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    };

    fetchTodos();
  }, [API_URL, authConfig, navigate, token]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/todos`,
        { text: newTodo },
        authConfig
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editedText.trim()) return;
    try {
      const res = await axios.patch(
        `${API_URL}/todos/${id}`,
        { text: editedText },
        authConfig
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingTodo(null);
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, authConfig);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const res = await axios.patch(
        `${API_URL}/todos/${id}`,
        { completed: !todo.completed },
        authConfig
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 relative p-4">
      <button
        onClick={logout}
        className="absolute top-6 right-6 bg-red-500 text-white px-6 py-2 rounded-lg shadow"
        type="button"
      >
        Logout
      </button>

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-9">
          <h1 className="text-2xl font-bold text-center mb-9">Task Manager</h1>

          <div className="flex justify-center gap-4 mb-6">
            {["all", "completed", "pending"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg ${
                  filter === type ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                type="button"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              className="flex-1 border p-2 rounded-lg"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 rounded-lg">
              Add
            </button>
          </form>

          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500">
              <IoClipboardOutline className="inline mr-2" />
              No tasks found
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo._id}
                  className="flex justify-between items-center"
                >
                  {editingTodo === todo._id ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        className="flex-1 border p-2 rounded"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(todo._id)}
                        className="p-2 bg-green-500 text-white rounded"
                      >
                        <MdOutlineDone />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTodo(null)}
                        className="p-2 bg-gray-300 rounded"
                      >
                        <IoClose />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleTodo(todo._id)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                            todo.completed ? "bg-green-500 text-white" : ""
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={14} />}
                        </button>

                        <div>
                          <span
                            className={
                              todo.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }
                          >
                            {todo.text}
                          </span>

                          <p className="text-xs text-gray-400 mt-1">
                          {todo.updatedAt && todo.updatedAt !== todo.createdAt
                            ? `Updated: ${formatDateTime(todo.updatedAt)}`
                            : `Created: ${formatDateTime(todo.createdAt)}`}
                        </p>

                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditing(todo)}
                          className="text-blue-500"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTodo(todo._id)}
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
