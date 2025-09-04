import { seedRoles } from './roleSeeder';
import { seedModules } from './moduleSeeder';
import { seedRolePermissions } from './rolePermissionSeeder';

export const runAllSeeders = async (): Promise<void> => {
  try {
    await seedRoles();
    await seedModules();
    await seedRolePermissions();
    
  } catch (error) {
    throw error;
  }
};

// Export individual seeders
export { seedRoles } from './roleSeeder';
export { seedModules } from './moduleSeeder';
export { seedRolePermissions } from './rolePermissionSeeder';

// Run all seeders if called directly
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}
