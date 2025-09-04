import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from "ajv-errors";
import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, assignRoleSchema, updateUserSchema, createProjectSchema, updateProjectSchema, assignProjectMemberSchema, createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema } from './validation';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const registerValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(registerSchema);

    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

const loginValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(loginSchema);

    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

const assignRoleValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(assignRoleSchema);

    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

const updateUserValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(updateUserSchema);

    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export { registerValidate, loginValidate, assignRoleValidate, updateUserValidate };

// Project validators
export const createProjectValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(createProjectSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export const updateProjectValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(updateProjectSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export const assignProjectMemberValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(assignProjectMemberSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

// Task validators
export const createTaskValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(createTaskSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export const updateTaskValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(updateTaskSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export const updateTaskStatusValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(updateTaskStatusSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}

export const assignTaskValidate = (req: Request, res: Response, next: NextFunction): void => {
    const validateSchema = ajv.compile(assignTaskSchema);
    const isValid = validateSchema(req.body);
    if (!isValid) {
        res.status(400).json({ errors: validateSchema.errors });
        return;
    }
    next();
}
