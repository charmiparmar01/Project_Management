import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, RolePermission, Module } from "../models";
import ERROR from "../messages/errors";

const MODULE_MAPPING = {
  1: 'User',
  2: 'Project', 
  3: 'Task'
};

export const authorizeRole = ({ module, action }: { module: number; action: "create" | "read" | "update" | "delete" }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
         res.status(401).json(ERROR.TOKEN_MISSING);
         return;
      }

      const token = authHeader.split(" ")[1];
      if (!token){
        res.status(401).json(ERROR.INVALID_TOKEN_FORMAT);
        return;
      } 

      const decodedToken: any = jwt.decode(token);

      if (!decodedToken || !decodedToken.permission.username || !decodedToken.permission.roleId){
        res.status(401).json(ERROR.INVALID_TOKEN);
        return;
      } 

      const moduleName = MODULE_MAPPING[module as keyof typeof MODULE_MAPPING];
      if (!moduleName) {
        res.status(400).json({ message: `Invalid module number: ${module}` });
        return;
      }

      const moduleDoc = await Module.findOne({ moduleName });
      if (!moduleDoc) {
        res.status(500).json({ message: `Module ${moduleName} not found in database` });
        return;
      }
      
      const rolePermission = await RolePermission.findOne({
        roleId: decodedToken.permission.roleId,
        moduleId: moduleDoc._id
      });

      if (!rolePermission) {
        res.status(403).json({ message: `Access Denied: No permissions for module ${moduleName}` });
        return;
      }
      
      let hasPermission = false;
      switch (action) {
        case 'create':
          hasPermission = rolePermission.canCreate;
          break;
        case 'read':
          hasPermission = rolePermission.canRead;
          break;
        case 'update':
          hasPermission = rolePermission.canUpdate;
          break;
        case 'delete':
          hasPermission = rolePermission.canDelete;
          break;
        default:
          hasPermission = false;
      }

      if (!hasPermission) {
        res.status(403).json({ message: `Access Denied: No ${action} access for module ${moduleName}` });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json(ERROR.SERVER_ERROR);
    }
  };
};
