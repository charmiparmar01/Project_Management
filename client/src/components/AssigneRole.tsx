import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, MenuItem, TextField, Button } from '@mui/material';
import { useAssignRoleMutation } from '../services/userApi';
import Navbar from './Navbar';

const AssigneRole: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('Employee');
  const [assignRole] = useAssignRoleMutation();

  const onSubmit = async () => {
    try {
      await assignRole({ id: (id as string), role }).unwrap();
      navigate('/users-list');
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Assign Role</Typography>
        <Box display="flex" gap={2}>
          <TextField select value={role} onChange={(e) => setRole(e.target.value)} label="Role" fullWidth>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </TextField>
          <Button variant="contained" onClick={onSubmit}>Assign</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default AssigneRole;


