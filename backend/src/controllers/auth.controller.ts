import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  /**
   * User login
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { userId, password, role } = req.body;

      // Validation
      if (!userId || !password || !role) {
        res.status(400).json({
          success: false,
          message: 'User ID, password, and role are required',
        });
        return;
      }

      // Find user
      const user = await User.findOne({ userId, role });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials or role mismatch',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

const token = jwt.sign(
  {
    userId: user.userId,
    role: user.role,
    email: user.email,
  },
  jwtSecret,
  { expiresIn: jwtExpiresIn } as jwt.SignOptions
);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
      });
    }
  }

  /**
   * Get current user details
   * GET /api/auth/me
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await User.findOne({ userId: req.user?.userId }).select(
        '-password'
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Logout (client-side token removal)
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}
