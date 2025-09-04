import React, { useMemo, useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
import { useCreateTaskMutation } from '../services/taskApi';
import { useGetUsersQuery } from '../services/userApi';
import { useGetProjectsQuery } from '../services/projectApi';
import { useNavigate} from 'react-router-dom';
import Navbar from './Navbar';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [errors, setErrors] = useState<{ title?: string; description?: string; assignedTo?: string; project?: string }>({});
  const { data: usersData } = useGetUsersQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const navigate = useNavigate();

  const users = useMemo(() => {
    const list = ((Array.isArray((usersData as any)?.data) ? (usersData as any).data : (Array.isArray(usersData) ? usersData : [])) as any[]);
    return list.filter(u => ((u.roleId && (u.roleId as any).roleName) || (u.role?.roleName) || u.role) === 'Employee');
  }, [usersData]);
  const projects = useMemo(() => ((Array.isArray((projectsData as any)?.data) ? (projectsData as any).data : (Array.isArray(projectsData) ? projectsData : [])) as any[]), [projectsData]);

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = 'Please enter a title';
    if (!description.trim()) nextErrors.description = 'Please enter a description';
    if (!assignedTo.trim()) nextErrors.assignedTo = 'Please select an employee';
    if (!project.trim()) nextErrors.project = 'Please select a project';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await createTask({ title, description, assignedToId: assignedTo, projectId: project }).unwrap();
    navigate('/tasks-list');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Create Task</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={!!errors.title} helperText={errors.title || ''} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description || ''} />
          <TextField select label="Assigned To" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} error={!!errors.assignedTo} helperText={errors.assignedTo || ''}>
            {users.map((u) => (
              <MenuItem key={u._id || u.id} value={u._id || u.id}>{u.username}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Project" value={project} onChange={(e) => setProject(e.target.value)} error={!!errors.project} helperText={errors.project || ''}>
            {projects.map((p) => (
              <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.projectName}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Create</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default CreateTask;


