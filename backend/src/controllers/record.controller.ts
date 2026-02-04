import { Response } from 'express';
import Record from '../models/Record.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class RecordController {
  /**
   * Get records for current user
   * GET /api/records
   */
  static async getRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;

      let query: any = {};

      // General users can only see their own records
      // Admins can see all records
      if (role === 'General User') {
        query.userId = userId;
      }

      const records = await Record.find(query).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: records,
        count: records.length,
        userRole: role,
      });
    } catch (error) {
      console.error('Get records error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve records',
      });
    }
  }

  /**
   * Get record by ID
   * GET /api/records/:recordId
   */
  static async getRecordById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId } = req.params;
      const userId = req.user?.userId;
      const role = req.user?.role;

      const record = await Record.findOne({ recordId });

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Record not found',
        });
        return;
      }

      // Check access permissions
      if (role === 'General User' && record.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this record',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (error) {
      console.error('Get record by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve record',
      });
    }
  }

  /**
   * Create new record
   * POST /api/records
   */
  static async createRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        status,
        priority,
        category,
        accessLevel,
        assignedTo,
        metadata,
      } = req.body;

      const userId = req.user?.userId;

      if (!title || !description || !category) {
        res.status(400).json({
          success: false,
          message: 'Title, description, and category are required',
        });
        return;
      }

      // Generate unique record ID
      const recordId = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const record = new Record({
        recordId,
        userId,
        title,
        description,
        status: status || 'Pending',
        priority: priority || 'Medium',
        category,
        accessLevel: accessLevel || 'Public',
        assignedTo,
        createdBy: userId,
        metadata,
      });

      await record.save();

      res.status(201).json({
        success: true,
        message: 'Record created successfully',
        data: record,
      });
    } catch (error) {
      console.error('Create record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create record',
      });
    }
  }

  /**
   * Update record
   * PUT /api/records/:recordId
   */
  static async updateRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId } = req.params;
      const userId = req.user?.userId;
      const role = req.user?.role;

      const record = await Record.findOne({ recordId });

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Record not found',
        });
        return;
      }

      // Check permissions
      if (role === 'General User' && record.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to update this record',
        });
        return;
      }

      // Update allowed fields
      const allowedUpdates = [
        'title',
        'description',
        'status',
        'priority',
        'category',
        'accessLevel',
        'assignedTo',
        'metadata',
      ];

      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          (record as any)[field] = req.body[field];
        }
      });

      await record.save();

      res.status(200).json({
        success: true,
        message: 'Record updated successfully',
        data: record,
      });
    } catch (error) {
      console.error('Update record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update record',
      });
    }
  }

  /**
   * Delete record
   * DELETE /api/records/:recordId
   */
  static async deleteRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId } = req.params;
      const userId = req.user?.userId;
      const role = req.user?.role;

      const record = await Record.findOne({ recordId });

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Record not found',
        });
        return;
      }

      // Check permissions
      if (role === 'General User' && record.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to delete this record',
        });
        return;
      }

      await Record.findOneAndDelete({ recordId });

      res.status(200).json({
        success: true,
        message: 'Record deleted successfully',
      });
    } catch (error) {
      console.error('Delete record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete record',
      });
    }
  }
}
