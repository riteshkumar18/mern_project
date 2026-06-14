import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!task.trim()) return;

    try {
      await axios.post("http://localhost:5000/add", {
        task,
      });

      setTask("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/update/${editId}`, {
        task: editTask,
      });

      setEditId(null);
      setEditTask("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "700px",
        margin: "40px auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Todo App</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <button onClick={handleAdd}>
          Add Task
        </button>
      </div>

      {tasks.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "12px",
          }}
        >
          {editId === item._id ? (
            <>
              <input
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  marginRight: "10px",
                }}
              />

              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  marginRight: "10px",
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span>{item.task}</span>

              <div>
                <button
                  onClick={() => {
                    setEditId(item._id);
                    setEditTask(item.task);
                  }}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    marginRight: "10px",
                  }}
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;