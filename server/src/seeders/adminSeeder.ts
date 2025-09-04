import { User, Role } from '../models';
import connectDB from '../database/connection';

const adminData = {
  username: 'admin',
  email: 'admin@mail.com',
  password: 'Admin@123',
  isActive: true
};

export const seedAdmin = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Find the Admin role
    const adminRole = await Role.findOne({ roleName: 'Admin' });
    if (!adminRole) {
      throw new Error('Admin role not found. Please run role seeder first.');
    }
    
    // Create admin user with Admin role
    const adminUser = new User({
      ...adminData,
      roleId: adminRole._id
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    
  } catch (error) {
    throw error;
  }
};

if (require.main === module) {
  seedAdmin()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}
