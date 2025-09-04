export type Role = 'Admin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: string;
  createdBy: string;
  project: string;
}


