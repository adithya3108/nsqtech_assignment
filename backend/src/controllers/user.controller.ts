import { Response } from 'express';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  /**
   * Get all users (Admin only)
   * GET /api/users
   */
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
      });
    }
  }

  /**
   * Get user by ID (Admin only)
   * GET /api/users/:userId
   */
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await User.findOne({ userId }).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
      });
    }
  }

  /**
   * Create new user (Admin only)
   * POST /api/users
   */
  static async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId, password, role, name, email, department } = req.body;

      // Validation
      if (!userId || !password || !role || !name || !email) {
        res.status(400).json({
          success: false,
          message: 'All required fields must be provided',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ userId }, { email }],
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User ID or email already exists',
        });
        return;
      }

      // Create user
      const user = new User({
        userId,
        password,
        role,
        name,
        email,
        department,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
      });
    }
  }

  /**
   * Update user (Admin only)
   * PUT /api/users/:userId
   */
  static async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { name, email, role, department, password } = req.body;

      const user = await User.findOne({ userId });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (department !== undefined) user.department = department;
      if (password) user.password = password; // Will be hashed by pre-save hook

      await user.save();

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
      });
    }
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/users/:userId
   */
  static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Prevent admin from deleting themselves
      if (userId === req.user?.userId) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
        });
        return;
      }

      const user = await User.findOneAndDelete({ userId });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
      });
    }
  }
}
