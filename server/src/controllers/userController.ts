import { Request, Response } from 'express';
import { User, Role } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils';
import ERROR from '../messages/errors';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json(ERROR.USER_ALREADY_EXISTS);
      return;
    }

    const desiredRoleName = (role && typeof role === 'string' && role.trim().length > 0) ? role : 'Employee';
    const roleDoc = await Role.findOne({ roleName: desiredRoleName });
    if (!roleDoc) {
      res.status(400).json({
        success: false,
        message: 'Invalid role name. Available roles: Admin, Manager, Employee'
      });
      return;
    }

    const user = new User({
      username,
      email,
      password,
      roleId: roleDoc._id
    });

    await user.save();

    const accessToken = generateAccessToken({ 
      permission: { 
        username: user.username, 
        email: user.email, 
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        roleId: (roleDoc._id as mongoose.Types.ObjectId).toString(),
        roleName: roleDoc.roleName
      } 
    });
    const refreshToken = generateRefreshToken({ 
      permission: { 
        username: user.username, 
        email: user.email, 
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        roleId: (roleDoc._id as mongoose.Types.ObjectId).toString(),
        roleName: roleDoc.roleName
      } 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: roleDoc.roleName,
          isActive: user.isActive
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};
    
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('roleId');
    if (!user) {
      res.status(401).json(ERROR.INVALID_CREDENTIALS);
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json(ERROR.INVALID_CREDENTIALS);
      return;
    }

    const accessToken = generateAccessToken({ 
      permission: { 
        username: user.username, 
        email: user.email, 
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        roleId: (user.roleId as any)?._id?.toString() || '',
        roleName: (user.roleId as any)?.roleName || 'No Role'
      } 
    });
    const refreshToken = generateRefreshToken({ 
      permission: { 
        username: user.username, 
        email: user.email, 
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        roleId: (user.roleId as any)?._id?.toString() || '',
        roleName: (user.roleId as any)?.roleName || 'No Role'
      } 
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: (user.roleId as any)?.roleName || 'No Role',
          isActive: user.isActive
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const existing = await User.findById(id).select('-password');
    if (!existing) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }
    if (!existing.isActive) {
      res.status(400).json({ success: false, message: 'User is not active' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await User.findById(id).select('-password');
    if (!existing) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }
    if (!existing.isActive) {
      res.status(400).json({ success: false, message: 'User is not active' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

export const assignRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const roleData = await Role.findOne({ roleName: role });
    if (!roleData) {
      res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { roleId: roleData._id },
      { new: true }
    ).populate('roleId').select('-password');

    if (!user) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error assigning role',
      error: error.message
    });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ isActive: true })
      .populate('roleId')
      .select('-password');

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('roleId')
      .select('-password');

    if (!user) {
      res.status(404).json(ERROR.USER_NOT_FOUND);
      return;
    }

    if (!user.isActive) {
      res.status(400).json({ success: false, message: 'User is not active' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};
