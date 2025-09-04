// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import EmployeePage from './pages/EmployeePage';
import UserList from './pages/UserList';
import TaskList from './pages/TaskList';
import ProjectList from './pages/ProjectList';
import CreateProject from './components/CreateProject';
import EditProject from './components/EditProject';
import AssignProjectMembers from './components/AssignProjectMembers';
import ProjectTasks from './pages/ProjectTasks';
import Register from './pages/Register';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import './App.css'
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import AssigneRole from './components/AssigneRole';
import UpdateStatus from './components/UpdateStatus';
import AssignTask from './components/AssignTask';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/users-list" element={<UserList />} />
          <Route path="/projects-list" element={<ProjectList />} />
          <Route path="/tasks-list" element={<TaskList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/assign-role/:id" element={<AssigneRole />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/edit-task/:id" element={<EditTask />} />
          <Route path="/update-status/:id" element={<UpdateStatus />} />
          <Route path="/assign-task/:id" element={<AssignTask />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/assign-project-members/:id" element={<AssignProjectMembers />} />
          <Route path="/projects/:id/tasks" element={<ProjectTasks />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;