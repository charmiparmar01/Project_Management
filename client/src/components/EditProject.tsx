import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useGetProjectQuery, useUpdateProjectMutation } from '../services/projectApi';
import Navbar from './Navbar';

const EditProject: React.FC = () => {
  const { id } = useParams();
  const { data } = useGetProjectQuery(id as string);
  const [updateProject] = useUpdateProjectMutation();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ projectName?: string; description?: string }>({});

  useEffect(() => {
    const proj = (data as any)?.data || data;
    if (proj) {
      setProjectName(proj.projectName);
      setDescription(proj.description || '');
    }
  }, [data]);

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!projectName.trim()) nextErrors.projectName = 'Please enter a project name';
    if (!description.trim()) nextErrors.description = 'Please enter a description';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await updateProject({ id, projectName, description }).unwrap();
    navigate('/projects-list');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Edit Project</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} error={!!errors.projectName} helperText={errors.projectName || ''} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description || ''} />
          <Button variant="contained" onClick={onSubmit}>Save</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default EditProject;


