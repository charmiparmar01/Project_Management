import express from 'express';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, assignProjectMember } from '../controllers/projectController';
import API from '../utils/api';
import authenticateToken from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { createProjectValidate, updateProjectValidate, assignProjectMemberValidate } from '../middlewares/ajvMiddleware';

const router = express.Router();

router.post(API.CREATE_PROJECT, authenticateToken, authorizeRole({ module: 2, action: 'create' }), createProjectValidate, createProject);
router.get(API.GET_ALL_PROJECTS, authenticateToken, authorizeRole({ module: 2, action: 'read' }), getAllProjects);
router.get(API.GET_PROJECT_BY_ID, authenticateToken, authorizeRole({ module: 2, action: 'read' }), getProjectById);
router.put(API.UPDATE_PROJECT, authenticateToken, authorizeRole({ module: 2, action: 'update' }), updateProjectValidate, updateProject);
router.delete(API.DELETE_PROJECT, authenticateToken, authorizeRole({ module: 2, action: 'delete' }), deleteProject);
router.post(API.ASSIGN_PROJECT_MEMBER, authenticateToken, authorizeRole({ module: 2, action: 'update' }), assignProjectMemberValidate, assignProjectMember);

export default router;


