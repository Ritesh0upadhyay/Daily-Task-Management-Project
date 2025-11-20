import prisma from "../config/database.js";

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, due_date, owner_id, assignee_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 2,
        status: status || "pending",
        due_date: due_date ? new Date(due_date) : null,
        owner_id: owner_id || null,
        assignee_id: assignee_id || null,
      },
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, due_date, owner_id, assignee_id, modified_by } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(owner_id !== undefined && { owner_id }),
        ...(assignee_id !== undefined && { assignee_id }),
        ...(modified_by && { modified_by }),
        updated_at: new Date(),
        modified_on: new Date(),
      },
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tasks by status
export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await prisma.task.findMany({
      where: { status },
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get today's tasks
export const getTodaysTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await prisma.task.findMany({
      where: {
        created_at: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        owner: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        assignee: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
