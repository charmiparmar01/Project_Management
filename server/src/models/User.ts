import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roleId?: mongoose.Types.ObjectId;
  role?: mongoose.Types.ObjectId;
  isActive: boolean;
  projectsCreated?: mongoose.Types.ObjectId[];
  tasksCreated?: mongoose.Types.ObjectId[];
  tasksAssigned?: mongoose.Types.ObjectId[];
  projectMembers?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getAllPermission(username: string): Promise<any>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  projectsCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  tasksCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  tasksAssigned: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  projectMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'ProjectMember'
  }]
}, {
  timestamps: true,
  collection: 'users',
  versionKey: false,
  id: false
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.getAllPermission = async function (username: string) {
  try {
    const user = await this.findOne({ username })
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissions',
          populate: {
            path: 'moduleId'
          }
        }
      });
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return {
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isActive: user.isActive
        },
        roles: user.roleId
      }
    };
  } catch (error) {
    return { success: false, message: 'Error fetching permissions' };
  }
};

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ roleId: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.model<IUser>('User', UserSchema);
