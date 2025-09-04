import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Box, Button, Alert } from '@mui/material';
import { useRegisterMutation, useLoginMutation } from '../services/authApi';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    if (!username.trim()) { setUsernameError('Please enter a username'); return; }
    if (!email.trim()) { setEmailError('Please enter an email'); return; }
    if (!password.trim()) { setPasswordError('Please enter a password'); return; }
    try {
      await register({ username, email, password }).unwrap();
      const res = await login({ email, password }).unwrap();
      sessionStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('UserInfo', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Manager') navigate('/manager');
      else navigate('/employee');
    } catch (e: any) {
      setError(e?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
        <Typography variant="h5" mb={2} fontWeight={600}>Create your account</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Default role is Employee.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={!!usernameError} helperText={usernameError || ''} />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailError} helperText={emailError || ''} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!passwordError} helperText={passwordError || ''} />
          <Button variant="contained" onClick={onRegister}>Register</Button>
          <Button component={Link} to="/login">Back to Login</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;


