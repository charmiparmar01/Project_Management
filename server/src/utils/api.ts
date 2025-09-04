const API = {
    REGISTER: '/register',
    LOGIN: '/login',
    UPDATE_USER: '/update-user/:id',
    DELETE_USER: '/delete-user/:id',
    ASSIGN_ROLE: '/assign-role/:id',
    GET_ALL_USER: '/users',
    GET_USER_BY_ID: '/user/:id',
    
    CREATE_PROJECT: '/create-project',
    UPDATE_PROJECT: '/update-project/:id',
    DELETE_PROJECT: '/delete-project/:id',
    GET_ALL_PROJECTS: '/projects',
    GET_PROJECT_BY_ID: '/project/:id',
    ASSIGN_PROJECT_MEMBER: '/assign-project-member/:id',
            
    CREATE_TASK: '/create-task',
    UPDATE_TASK: '/update-task/:id',
    DELETE_TASK: '/delete-task/:id',
    GET_ALL_TASKS: '/tasks',
    GET_TASK_BY_ID: '/task/:id',
    UPDATE_TASK_STATUS: '/update-task-status/:id',
    ASSIGN_TASK: '/assign-task/:id'
};

export default API;
