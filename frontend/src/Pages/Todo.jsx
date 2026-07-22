import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Todo.css";

function Todo() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [tasks, setTasks] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [search, page]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/tasks?search=${search}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/add",
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTitle("");
      setContent("");

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/update/${editId}`,
        {
          title: editTitle,
          content: editContent,
        },
                {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditId(null);
      setEditTitle("");
      setEditContent("");

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
            <h1>📝 MERN Notes App</h1>
            <p>Welcome, {user?.fullName}</p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Search Section */}

        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search Notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Add Note */}

        <div className="add-section">
          <input
            type="text"
            placeholder="Enter Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="note-textarea"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={handleAdd}
          >
            Add Note
          </button>
        </div>

        {tasks.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#666",
            }}
          >
            No Notes Available.
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
                    placeholder="Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="edit-input note-textarea"
                    placeholder="Content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
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
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="update-btn"
                      onClick={() => {
                        setEditId(item._id);
                        setEditTitle(item.title);
                        setEditContent(item.content);
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
                <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            ⬅ Previous
          </button>

          <span className="page-number">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next ➡
          </button>
        </div>

      </div>
    </div>
  );
}

export default Todo;