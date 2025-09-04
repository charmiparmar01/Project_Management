import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectMember extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectMemberSchema = new Schema<IProjectMember>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'projectmembers',
  versionKey: false,
  id: false
});

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

ProjectMemberSchema.index({ projectId: 1 });
ProjectMemberSchema.index({ userId: 1 });

export default mongoose.model<IProjectMember>('ProjectMember', ProjectMemberSchema);
