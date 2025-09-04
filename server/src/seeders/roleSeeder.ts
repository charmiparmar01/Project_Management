import { Role } from '../models';
import connectDB from '../database/connection';

const roles = [
  {
    roleName: 'Admin',
  },
  {
    roleName: 'Manager',
  },
  {
    roleName: 'Employee',
  }
];

export const seedRoles = async (): Promise<void> => {
  try {
    await connectDB();
    
    await Role.deleteMany({});
    await Role.insertMany(roles);
    
  } catch (error) {
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedRoles()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}
