import mongoose from 'mongoose';
import User from '../models/User.model';
import Record from '../models/Record.model';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nsqtech';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const seedDatabase = async (): Promise<void> => {
  try {
    // Always clear existing data to ensure fresh seed with hashed passwords
    const userCount = await User.countDocuments();
    const recordCount = await Record.countDocuments();
    
    if (userCount > 0) {
      console.log('Clearing existing users for fresh seed...');
      await User.deleteMany({});
    }
    
    if (recordCount > 0) {
      console.log('Clearing existing records for fresh seed...');
      await Record.deleteMany({});
    }

    console.log('Seeding database...');

    // Create users
    // Create users one by one to trigger pre-save hooks for password hashing
    const adminUser = new User({
      userId: 'admin001',
      password: 'Admin@123',
      role: 'Admin',
      name: 'Administrator',
      email: 'admin@nsqtech.com',
      department: 'IT Operations',
    });
    await adminUser.save();

    const user1 = new User({
      userId: 'user001',
      password: 'User@123',
      role: 'General User',
      name: 'John Doe',
      email: 'john.doe@nsqtech.com',
      department: 'Engineering',
    });
    await user1.save();

    const user2 = new User({
      userId: 'user002',
      password: 'User@123',
      role: 'General User',
      name: 'Jane Smith',
      email: 'jane.smith@nsqtech.com',
      department: 'Marketing',
    });
    await user2.save();

    const user3 = new User({
      userId: 'user003',
      password: 'User@123',
      role: 'General User',
      name: 'Robert Johnson',
      email: 'robert.johnson@nsqtech.com',
      department: 'Sales',
    });
    await user3.save();

    console.log('✅ Users created');

    // Create sample records
    const records = [
      // Records for user001
      {
        recordId: 'REC-001',
        userId: 'user001',
        title: 'Background Verification - Tech Corp',
        description: 'Complete background verification for employment at Tech Corp',
        status: 'In Progress',
        priority: 'High',
        category: 'Employment Verification',
        accessLevel: 'Private',
        createdBy: 'user001',
        metadata: { company: 'Tech Corp', position: 'Senior Developer' },
      },
      {
        recordId: 'REC-002',
        userId: 'user001',
        title: 'Education Verification - MIT',
        description: 'Verify Master\'s degree from MIT',
        status: 'Completed',
        priority: 'Medium',
        category: 'Education Verification',
        accessLevel: 'Public',
        createdBy: 'user001',
        metadata: { institution: 'MIT', degree: 'MS Computer Science' },
      },
      {
        recordId: 'REC-003',
        userId: 'user001',
        title: 'Identity Verification',
        description: 'Government ID and address proof verification',
        status: 'Completed',
        priority: 'High',
        category: 'Identity Verification',
        accessLevel: 'Restricted',
        createdBy: 'user001',
      },
      // Records for user002
      {
        recordId: 'REC-004',
        userId: 'user002',
        title: 'Employment History Check',
        description: 'Verify previous employment at Digital Solutions Inc.',
        status: 'Pending',
        priority: 'Medium',
        category: 'Employment Verification',
        accessLevel: 'Private',
        createdBy: 'user002',
        metadata: { company: 'Digital Solutions Inc.', duration: '2020-2023' },
      },
      {
        recordId: 'REC-005',
        userId: 'user002',
        title: 'Professional References',
        description: 'Contact and verify professional references',
        status: 'In Progress',
        priority: 'Low',
        category: 'Reference Check',
        accessLevel: 'Public',
        createdBy: 'user002',
      },
      // Records for user003
      {
        recordId: 'REC-006',
        userId: 'user003',
        title: 'Criminal Background Check',
        description: 'Standard criminal background verification',
        status: 'Completed',
        priority: 'High',
        category: 'Criminal Verification',
        accessLevel: 'Restricted',
        createdBy: 'user003',
      },
      {
        recordId: 'REC-007',
        userId: 'user003',
        title: 'Credit History Check',
        description: 'Financial background and credit score verification',
        status: 'Rejected',
        priority: 'Medium',
        category: 'Financial Verification',
        accessLevel: 'Private',
        createdBy: 'user003',
        metadata: { reason: 'Insufficient documentation' },
      },
      {
        recordId: 'REC-008',
        userId: 'user003',
        title: 'Address Verification',
        description: 'Current and previous address verification',
        status: 'In Progress',
        priority: 'Low',
        category: 'Address Verification',
        accessLevel: 'Public',
        createdBy: 'user003',
      },
    ];

    await Record.insertMany(records);
    console.log('✅ Records created');

    console.log('\n📋 Seed Data Summary:');
    console.log('Admin User - userId: admin001, password: Admin@123');
    console.log('General User 1 - userId: user001, password: User@123');
    console.log('General User 2 - userId: user002, password: User@123');
    console.log('General User 3 - userId: user003, password: User@123');
    console.log('\n✅ Database seeding completed successfully\n');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  }
};