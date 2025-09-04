import express from 'express';
import {
  register,
  login,
  updateUser,
  deleteUser,
  assignRole,
  getUser,
  getUserById
} from '../controllers/userController';
import API from '../utils/api';
import { registerValidate, loginValidate, assignRoleValidate, updateUserValidate } from '../middlewares/ajvMiddleware';
import authenticateToken from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = express.Router();

// Routes
router.post(API.REGISTER, registerValidate, register);
// router.post(API.REGISTER, authenticateToken, authorizeRole({ module: 1, action: 'create' }), registerValidate, register);
router.post(API.LOGIN, loginValidate, login);
router.put(API.UPDATE_USER, authenticateToken, authorizeRole({ module: 1, action: 'update' }), updateUserValidate, updateUser);
router.delete(API.DELETE_USER, authenticateToken, authorizeRole({ module: 1, action: 'delete' }), deleteUser);
router.put(API.ASSIGN_ROLE, authenticateToken, authorizeRole({ module: 1, action: 'update' }), assignRoleValidate, assignRole);
router.get(API.GET_ALL_USER, authenticateToken, authorizeRole({ module: 1, action: 'read' }), getUser);
router.get(API.GET_USER_BY_ID, authenticateToken, authorizeRole({ module: 1, action: 'read' }), getUserById);

export default router;
