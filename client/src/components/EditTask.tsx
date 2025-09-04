import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useGetTaskQuery, useUpdateTaskMutation } from '../services/taskApi';
import Navbar from './Navbar';

const EditTask: React.FC = () => {
  const { id } = useParams();
  const { data } = useGetTaskQuery(id as string);
  const [updateTask] = useUpdateTaskMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const task = (data as any)?.data || data;
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      // status is edited via UpdateStatus screen only
    }
  }, [data]);

  const onSubmit = async () => {
    await updateTask({ id, title, description }).unwrap();
    navigate('/tasks-list');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Edit Task</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <Button variant="contained" onClick={onSubmit}>Save</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default EditTask;


