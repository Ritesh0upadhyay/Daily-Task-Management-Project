import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Daily Task Management Backend is running..." });
});

app.use("/api/tasks", taskRoutes);

export default app;
