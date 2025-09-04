const registerSchema = {
    type: "object",
    properties: {
        username: { type: "string", minLength: 2, errorMessage: 'Please enter a username' },
        email: { type: "string", format: 'email', errorMessage: 'Valid email is required' },
        password: { 
            type: "string", 
            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$', 
            errorMessage: "Password must contain at least one letter, one number, and one special character and at least 6 character long"
        },
        role: { type: "string", enum: ['Admin', 'Manager', 'Employee'] },
    },
    required: ["username", "email", "password"],
    additionalProperties: false,
};

const loginSchema = {
    type: "object",
    properties: {
        email: { type: "string", format: 'email', errorMessage: 'Valid email is required' },
        password: { 
            type: "string", 
            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$', 
            errorMessage: "Password must contain at least one letter, one number, and one special character and at least 6 character long"
        },
    },
    required: ["email", "password"],
    additionalProperties: false,
};

const assignRoleSchema = {
    type: "object",
    properties: {
        role: { type: "string", enum: ['Admin', 'Manager', 'Employee'], errorMessage: 'Role is required' },
    },
    required: ["role"],
    additionalProperties: false,
}

const updateUserSchema = {
    type: "object",
    properties: {
        username: { type: "string", minLength: 2, errorMessage: 'Please enter a username' },
        email: { type: "string", format: 'email', errorMessage: 'Valid email is required' },
        password: { 
            type: "string", 
            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$', 
            errorMessage: "Password must contain at least one letter, one number, and one special character and at least 6 character long"
        },
    },
    required: ["username", "email"],
    additionalProperties: false,
};

const createProjectSchema = {
    type: "object",
    properties: {
        projectName: { type: "string", minLength: 2, errorMessage: 'Please enter a project name' },
        description: { type: "string" }
    },
    required: ["projectName"],
    additionalProperties: false,
};

const updateProjectSchema = {
    type: "object",
    properties: {
        projectName: { type: "string", minLength: 2 },
        description: { type: "string" }
    },
    required: ["projectName"],
    additionalProperties: false,
};

const assignProjectMemberSchema = {
    type: "object",
    properties: {
        userId: { type: "string", errorMessage: 'User id is required' }
    },
    required: ["userId"],
    additionalProperties: false,
};

export { registerSchema, loginSchema, assignRoleSchema, updateUserSchema, createProjectSchema, updateProjectSchema, assignProjectMemberSchema };

// Task Schemas
const createTaskSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 2, errorMessage: 'Please enter a title' },
        description: { type: "string" },
        projectId: { type: "string", errorMessage: 'Project id is required' },
        assignedToId: { type: "string" }
    },
    required: ["title", "projectId"],
    additionalProperties: false,
};

const updateTaskSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 2 },
        description: { type: "string" }
    },
    required: ["title"],
    additionalProperties: false,
};

const updateTaskStatusSchema = {
    type: "object",
    properties: {
        status: { type: "string", enum: ['TODO','IN_PROGRESS','DONE'], errorMessage: 'Valid status is required' }
    },
    required: ["status"],
    additionalProperties: false,
};

const assignTaskSchema = {
    type: "object",
    properties: {
        assignedToId: { type: "string", errorMessage: 'User id is required' }
    },
    required: ["assignedToId"],
    additionalProperties: false,
};

export { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema };
