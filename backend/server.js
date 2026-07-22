const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware"); // authentication middleware

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// =====================
// NOTE (TASK) MODEL
// =====================

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

// =====================
// AUTH ROUTES
// =====================

app.use("/auth", authRoutes);

// =====================
// CRUD ROUTES
// =====================

// Add Note
app.post("/add", protect, async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      content: req.body.content,
      owner: req.user.id,
    });

    res.json(newTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/tasks", protect, async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = 5;

    const filter = {
      owner: req.user.id,
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const totalNotes = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalNotes / limit),
    });

  } catch (error) {
    res.status(500).json(error);
  }
});
// Delete My Note
app.delete("/delete/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note Deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update My Note
app.put("/update/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    task.title = req.body.title;
    task.content = req.body.content;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});