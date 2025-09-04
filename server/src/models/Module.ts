import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  moduleName: string;
  permissions?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ModuleSchema = new Schema<IModule>({
  moduleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'RolePermission'
  }]
}, {
  timestamps: true,
  collection: 'modules',
  versionKey: false,
  id: false
});

ModuleSchema.index({ moduleName: 1 });

export default mongoose.model<IModule>('Module', ModuleSchema);
