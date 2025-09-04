import mongoose, { Document, Schema } from 'mongoose';

export interface IRolePermission extends Document {
  roleId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  role?: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const RolePermissionSchema = new Schema<IRolePermission>({
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  canCreate: {
    type: Boolean,
    default: false
  },
  canRead: {
    type: Boolean,
    default: false
  },
  canUpdate: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'rolepermissions',
  versionKey: false,
  id: false
});

RolePermissionSchema.index({ roleId: 1, moduleId: 1 }, { unique: true });

RolePermissionSchema.index({ roleId: 1 });
RolePermissionSchema.index({ moduleId: 1 });

export default mongoose.model<IRolePermission>('RolePermission', RolePermissionSchema);
