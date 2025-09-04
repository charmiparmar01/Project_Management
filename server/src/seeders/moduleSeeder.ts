import { Module } from '../models';
import connectDB from '../database/connection';

const modules = [
  {
    moduleName: 'User',
  },
  {
    moduleName: 'Project',
  },
  {
    moduleName: 'Task',
  }
];

export const seedModules = async (): Promise<void> => {
  try {
    await connectDB();
    
    await Module.deleteMany({});
    await Module.insertMany(modules);
    
  } catch (error) {
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedModules()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}
