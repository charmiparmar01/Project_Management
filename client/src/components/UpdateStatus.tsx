import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { useUpdateTaskStatusMutation } from '../services/taskApi';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const UpdateStatus: React.FC = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const navigate = useNavigate();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const onSubmit = async () => {
    await updateTaskStatus({ id: id as string, status }).unwrap();
    navigate('/tasks-list');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Update Task Status</Typography>
        <Box display="flex" gap={2}>
          <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} fullWidth>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </TextField>
          <Button variant="contained" onClick={onSubmit}>Update</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default UpdateStatus;


