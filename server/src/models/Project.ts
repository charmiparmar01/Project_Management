import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  projectName: string;
  description?: string;
  createdById: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  members?: mongoose.Types.ObjectId[];
  tasks?: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'ProjectMember'
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'projects',
  versionKey: false,
  id: false
});

ProjectSchema.index({ projectName: 1 });
ProjectSchema.index({ createdById: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ createdAt: -1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
