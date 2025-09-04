import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useGetUserQuery, useUpdateUserMutation } from '../services/userApi';
import Navbar from './Navbar';

const EditUser: React.FC = () => {
  const { id } = useParams();
  const { data } = useGetUserQuery(id as string);
  const [updateUser] = useUpdateUserMutation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});
  const navigate = useNavigate();

  useEffect(() => { 
    const user = (data as any)?.data || data;
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [data]);

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!username.trim()) nextErrors.username = 'Please enter a username';
    if (!email.trim()) nextErrors.email = 'Please enter an email';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await updateUser({ id, username, email }).unwrap();
    navigate('/users-list');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Edit User</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={!!errors.username} helperText={errors.username || ''} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || ''} />
          <Button variant="contained" onClick={onSubmit}>Save</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default EditUser;


