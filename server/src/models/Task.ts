import mongoose, { Document, Schema } from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  createdById?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  assignedToId?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
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
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedToId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'tasks',
  versionKey: false,
  id: false
});

TaskSchema.index({ title: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ createdById: 1 });
TaskSchema.index({ assignedToId: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.model<ITask>('Task', TaskSchema);
