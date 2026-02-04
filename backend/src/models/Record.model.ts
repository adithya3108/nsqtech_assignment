import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
  recordId: string;
  userId: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  createdBy: string;
  category: string;
  accessLevel: 'Public' | 'Private' | 'Restricted';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const RecordSchema: Schema = new Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    assignedTo: {
      type: String,
      ref: 'User',
    },
    createdBy: {
      type: String,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
    },
    accessLevel: {
      type: String,
      enum: ['Public', 'Private', 'Restricted'],
      default: 'Public',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
RecordSchema.index({ userId: 1, createdAt: -1 });
RecordSchema.index({ status: 1 });
RecordSchema.index({ accessLevel: 1 });

export default mongoose.model<IRecord>('Record', RecordSchema);
