import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project, ProjectMember, User, Role } from '../models';
import ERROR from '../messages/errors';

// Create Project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectName, description } = req.body;

    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) {
      res.status(401).json(ERROR.TOKEN_MISSING);
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = token ? (require('jsonwebtoken').decode(token)) : null;
    const creatorId = decoded?.permission?.userId;
    if (!creatorId) {
      res.status(401).json(ERROR.INVALID_TOKEN);
      return;
    }

    const creator = await User.findById(creatorId).populate('roleId');
    if (!creator) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }
    if (!creator.isActive) {
      res.status(400).json({ success: false, message: 'User is not active' });
      return;
    }

    const project = await Project.create({
      projectName,
      description,
      createdById: creator._id as unknown as mongoose.Types.ObjectId
    });

    await User.findByIdAndUpdate(
      creator._id,
      { $addToSet: { projectsCreated: project._id as unknown as mongoose.Types.ObjectId } },
      { new: false }
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
  }
};

// Get all Projects (active only)
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) {
      res.status(401).json(ERROR.TOKEN_MISSING);
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = token ? (require('jsonwebtoken').decode(token)) : null;
    const requesterId = decoded?.permission?.userId;
    const roleName = decoded?.permission?.roleName;
    if (!requesterId || !roleName) {
      res.status(401).json(ERROR.INVALID_TOKEN);
      return;
    }

    if (roleName === 'Admin') {
      const projects = await Project.find({ isActive: true });
      res.status(200).json({ success: true, message: 'Projects retrieved successfully', data: projects, count: projects.length });
      return;
    }

    const memberships = await ProjectMember.find({ userId: requesterId });
    const memberProjectIds = memberships.map(m => m.projectId);

    const projects = await Project.find({
      isActive: true,
      $or: [
        { createdById: requesterId as unknown as mongoose.Types.ObjectId },
        { _id: { $in: memberProjectIds as unknown as mongoose.Types.ObjectId[] } }
      ]
    });

    res.status(200).json({ success: true, message: 'Projects retrieved successfully', data: projects, count: projects.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving projects', error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    if (!project.isActive) {
      res.status(400).json({ success: false, message: 'Project is not active' });
      return;
    }
    res.status(200).json({ success: true, message: 'Project retrieved successfully', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving project', error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { projectName, description } = req.body;

    const existing = await Project.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    if (!existing.isActive) {
      res.status(400).json({ success: false, message: 'Project is not active' });
      return;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { projectName, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await Project.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    if (!existing.isActive) {
      res.status(400).json({ success: false, message: 'Project is not active' });
      return;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Project deleted successfully', data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
  }
};

export const assignProjectMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // project id
    const { userId } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    if (!project.isActive) {
      res.status(400).json({ success: false, message: 'Project is not active' });
      return;
    }

    const user = await User.findById(userId).populate('roleId');
    if (!user) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }
    if (!user.isActive) {
      res.status(400).json({ success: false, message: 'User is not active' });
      return;
    }

    console.log(user);
    const roleName = (user.roleId as any)?.roleName || '';
    if (!['Employee', 'Manager'].includes(roleName)) {
      res.status(400).json({ success: false, message: 'Only Employee or Manager can be assigned to a project' });
      return;
    }

    const membership = await ProjectMember.create({
      projectId: project._id as unknown as mongoose.Types.ObjectId,
      userId: user._id as unknown as mongoose.Types.ObjectId
    });

    await Promise.all([
      Project.findByIdAndUpdate(project._id, { $addToSet: { members: membership._id as unknown as mongoose.Types.ObjectId } }),
      User.findByIdAndUpdate(user._id, { $addToSet: { projectMembers: membership._id as unknown as mongoose.Types.ObjectId } })
    ]);

    res.status(200).json({ success: true, message: 'Member assigned successfully', data: membership });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(400).json({ success: false, message: 'Member already assigned to this project' });
      return;
    }
    res.status(500).json({ success: false, message: 'Error assigning member', error: error.message });
  }
};


