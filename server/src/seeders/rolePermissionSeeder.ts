import { Role, Module, RolePermission } from '../models';
import connectDB from '../database/connection';

export const seedRolePermissions = async (): Promise<void> => {
  try {
    await connectDB();
    
    const roles = await Role.find({});
    const modules = await Module.find({});
    
    if (roles.length === 0) {
      throw new Error('No roles found. Please run role seeder first.');
    }
    
    if (modules.length === 0) {
      throw new Error('No modules found. Please run module seeder first.');
    }
    
    await RolePermission.deleteMany({});
    
    const rolePermissions = [];
    
    for (const role of roles) {
      for (const module of modules) {
        let canCreate = false;
        let canRead = false;
        let canUpdate = false;
        let canDelete = false;
        
        // Admin - Full access to everything
        if (role.roleName === 'Admin') {
          canCreate = true;
          canRead = true;
          canUpdate = true;
          canDelete = true;
        }
        // Manager - Full access to projects and tasks
        else if (role.roleName === 'Manager') {
          canCreate = true;
          canRead = true;
          canUpdate = true;
          canDelete = true;
        }
        // Employee - Read and update access only
        else if (role.roleName === 'Employee') {
          canCreate = false;
          canRead = true;
          canUpdate = true;
          canDelete = false;
        }
        
        rolePermissions.push({
          roleId: role._id,
          moduleId: module._id,
          canCreate,
          canRead,
          canUpdate,
          canDelete
        });
      }
    }
    
    await RolePermission.insertMany(rolePermissions);
    
  } catch (error) {
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedRolePermissions()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}
