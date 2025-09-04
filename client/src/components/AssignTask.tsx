import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { useAssignTaskMutation } from '../services/taskApi';
import { useGetUsersQuery } from '../services/userApi';
import Navbar from './Navbar';

const AssignTask: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignee, setAssignee] = useState('');
  const [assignTask, { isLoading }] = useAssignTaskMutation();
  const { data: usersData } = useGetUsersQuery();

  const employees = useMemo(() => {
    const list = ((Array.isArray((usersData as any)?.data) ? (usersData as any).data : (Array.isArray(usersData) ? usersData : [])) as any[]);
    return list.filter(u => ((u.roleId && (u.roleId as any).roleName) || (u.role?.roleName) || u.role) === 'Employee');
  }, [usersData]);

  const onSubmit = async () => {
    await assignTask({ id: id as string, assignedToId: assignee }).unwrap();
    navigate('/tasks-list');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Assign Task</Typography>
          <Box display="flex" gap={2}>
            <TextField select label="Employee" value={assignee} onChange={(e) => setAssignee(e.target.value)} fullWidth>
              {employees.map((u) => (
                <MenuItem key={u._id || u.id} value={u._id || u.id}>{u.username}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Assign</Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AssignTask;
