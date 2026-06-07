const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const TaskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("Task", TaskSchema);

// Add Task
app.post("/add", async (req, res) => {
  try {
    const newTask = await Task.create({
      task: req.body.task,
    });

    res.json(newTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Task
app.delete("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});