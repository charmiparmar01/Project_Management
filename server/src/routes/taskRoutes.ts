import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskStatus, assignTask } from '../controllers/taskController';
import API from '../utils/api';
import authenticateToken from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { createTaskValidate, updateTaskValidate, updateTaskStatusValidate, assignTaskValidate } from '../middlewares/ajvMiddleware';

const router = express.Router();

router.post(API.CREATE_TASK, authenticateToken, authorizeRole({ module: 3, action: 'create' }), createTaskValidate, createTask);
router.get(API.GET_ALL_TASKS, authenticateToken, authorizeRole({ module: 3, action: 'read' }), getAllTasks);
router.get(API.GET_TASK_BY_ID, authenticateToken, authorizeRole({ module: 3, action: 'read' }), getTaskById);
router.put(API.UPDATE_TASK, authenticateToken, authorizeRole({ module: 3, action: 'update' }), updateTaskValidate, updateTask);
router.delete(API.DELETE_TASK, authenticateToken, authorizeRole({ module: 3, action: 'delete' }), deleteTask);
router.put(API.UPDATE_TASK_STATUS, authenticateToken, authorizeRole({ module: 3, action: 'update' }), updateTaskStatusValidate, updateTaskStatus);
router.put(API.ASSIGN_TASK, authenticateToken, authorizeRole({ module: 3, action: 'update' }), assignTaskValidate, assignTask);

export default router;


