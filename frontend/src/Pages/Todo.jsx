import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Todo.css";

function Todo() {
  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    if (!task.trim()) return;

    try {
      await axios.post("http://localhost:5000/add", {
        task,
      });

      setTask("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    if (!editTask.trim()) return;

    try {
      await axios.put(`http://localhost:5000/update/${editId}`, {
        task: editTask,
      });

      setEditId(null);
      setEditTask("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="todo-page">
      <div className="todo-container">

        <div className="todo-header">
          <div>
            <h1>📝 MERN Todo App</h1>
            <p>Welcome, {user?.fullName}</p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="add-section">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={handleAdd}
          >
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#666",
            }}
          >
            No tasks available.
          </p>
        ) : (
          tasks.map((item) => (
            <div
              className="task-card"
              key={item._id}
            >
              {editId === item._id ? (
                <>
                  <input
                    className="edit-input"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                  />

                  <button
                    className="save-btn"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="task-text">
                    📌 {item.task}
                  </div>

                  <div className="action-buttons">

                    <button
                      className="update-btn"
                      onClick={() => {
                        setEditId(item._id);
                        setEditTask(item.task);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>

                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Todo;