import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTodaysTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// Get all tasks
router.get("/", getAllTasks);

// Get today's tasks
router.get("/today", getTodaysTasks);

// Get tasks by status
router.get("/status/:status", getTasksByStatus);

// Get task by ID
router.get("/:id", getTaskById);

// Create a new task
router.post("/", createTask);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;
