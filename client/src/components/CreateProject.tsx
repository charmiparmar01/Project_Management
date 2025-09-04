import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useCreateProjectMutation } from '../services/projectApi';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [errors, setErrors] = useState<{ projectName?: string; description?: string }>({});
  const navigate = useNavigate();

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!projectName.trim()) nextErrors.projectName = 'Please enter a project name';
    if (!description.trim()) nextErrors.description = 'Please enter a description';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await createProject({ projectName, description }).unwrap();
    navigate('/projects-list');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Create Project</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} error={!!errors.projectName} helperText={errors.projectName || ''} />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description || ''} />
            <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Create</Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateProject;


