import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task, Project, User } from '../models';
import { TaskStatus } from '../models/Task';
import ERROR from '../messages/errors';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, projectId, assignedToId } = req.body;

    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) { res.status(401).json(ERROR.TOKEN_MISSING); return; }
    const token = authHeader.split(' ')[1];
    const decoded: any = token ? (require('jsonwebtoken').decode(token)) : null;
    const creatorId = decoded?.permission?.userId;
    if (!creatorId) { res.status(401).json(ERROR.INVALID_TOKEN); return; }

    const project = await Project.findById(projectId);
    if (!project || !project.isActive) {
      res.status(400).json({ success: false, message: 'Invalid or inactive project' });
      return;
    }

    if (assignedToId) {
      const assignee = await User.findById(assignedToId);
      if (!assignee || !assignee.isActive) {
        res.status(400).json({ success: false, message: 'Invalid or inactive assignee' });
        return;
      }
    }

    const task = await Task.create({
      title,
      description,
      projectId: project._id as unknown as mongoose.Types.ObjectId,
      createdById: creatorId as unknown as mongoose.Types.ObjectId,
      assignedToId: assignedToId ? assignedToId as unknown as mongoose.Types.ObjectId : undefined
    });

    await Promise.all([
      User.findByIdAndUpdate(creatorId, { $addToSet: { tasksCreated: task._id as unknown as mongoose.Types.ObjectId } }),
      Project.findByIdAndUpdate(project._id, { $addToSet: { tasks: task._id as unknown as mongoose.Types.ObjectId } })
    ]);

    if (assignedToId) {
      await User.findByIdAndUpdate(assignedToId, { $addToSet: { tasksAssigned: task._id as unknown as mongoose.Types.ObjectId } });
    }

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error creating task', error: error.message });
  }
};

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) { res.status(401).json(ERROR.TOKEN_MISSING); return; }
    const token = authHeader.split(' ')[1];
    const decoded: any = token ? (require('jsonwebtoken').decode(token)) : null;
    const userId = decoded?.permission?.userId;
    const roleName = decoded?.permission?.roleName;
    if (!userId || !roleName) { res.status(401).json(ERROR.INVALID_TOKEN); return; }

    if (roleName === 'Admin') {
      const tasks = await Task.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, message: 'Tasks retrieved successfully', data: tasks, count: tasks.length });
      return;
    }

    const tasks = await Task.find({
      $or: [
        { createdById: userId as unknown as mongoose.Types.ObjectId },
        { assignedToId: userId as unknown as mongoose.Types.ObjectId }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Tasks retrieved successfully', data: tasks, count: tasks.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving tasks', error: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    res.status(200).json({ success: true, message: 'Task retrieved successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving task', error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true, runValidators: true });
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating task', error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    res.status(200).json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting task', error: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: TaskStatus };
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    res.status(200).json({ success: true, message: 'Task status updated successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating task status', error: error.message });
  }
};

export const assignTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;
    const assignee = await User.findById(assignedToId);
    if (!assignee || !assignee.isActive) {
      res.status(400).json({ success: false, message: 'Invalid or inactive assignee' });
      return;
    }
    const task = await Task.findByIdAndUpdate(id, { assignedToId }, { new: true, runValidators: true });
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }   
    await User.findByIdAndUpdate(assignedToId, { $addToSet: { tasksAssigned: (task._id as unknown as mongoose.Types.ObjectId) } });
    res.status(200).json({ success: true, message: 'Task assigned successfully', data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error assigning task', error: error.message });
  }
};


