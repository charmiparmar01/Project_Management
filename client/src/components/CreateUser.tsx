import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useRegisterMutation } from '../services/authApi';
import Navbar from './Navbar';

const CreateUser: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!username.trim()) nextErrors.username = 'Please enter a username';
    if (!email.trim()) nextErrors.email = 'Please enter an email';
    if (!password.trim()) nextErrors.password = 'Please enter a password';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await registerUser({ username, email, password }).unwrap();
    setUsername(''); setEmail(''); setPassword('');
  };

  return (
    <> <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Create User (default role Employee)</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={!!errors.username} helperText={errors.username || ''} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || ''} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password || ''} />
          <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Create</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default CreateUser;


