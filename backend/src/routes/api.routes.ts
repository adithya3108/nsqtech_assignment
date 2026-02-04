import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { RecordController } from '../controllers/record.controller';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware';
import { simulateDelay } from '../middleware/delay.middleware';

const router = express.Router();

// Public routes
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);

// Protected routes - require authentication
router.get('/auth/me', authenticate, simulateDelay, AuthController.getCurrentUser);

// Record routes
router.get('/records', authenticate, simulateDelay, RecordController.getRecords);
router.get('/records/:recordId', authenticate, simulateDelay, RecordController.getRecordById);
router.post('/records', authenticate, RecordController.createRecord);
router.put('/records/:recordId', authenticate, RecordController.updateRecord);
router.delete('/records/:recordId', authenticate, RecordController.deleteRecord);

// User management routes - Admin only
router.get('/users', authenticate, authorizeAdmin, simulateDelay, UserController.getAllUsers);
router.get('/users/:userId', authenticate, authorizeAdmin, simulateDelay, UserController.getUserById);
router.post('/users', authenticate, authorizeAdmin, UserController.createUser);
router.put('/users/:userId', authenticate, authorizeAdmin, UserController.updateUser);
router.delete('/users/:userId', authenticate, authorizeAdmin, UserController.deleteUser);

export default router;
