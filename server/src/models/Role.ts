import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  roleName: string;
  users?: mongoose.Types.ObjectId[];
  permissions?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const RoleSchema = new Schema<IRole>({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'RolePermission'
  }]
}, {
  timestamps: true,
  collection: 'roles',
  versionKey: false,
  id: false
});

RoleSchema.index({ roleName: 1 });

export default mongoose.model<IRole>('Role', RoleSchema);
