import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useLoginMutation } from '../services/authApi';
import { Link } from 'react-router-dom';
import { resetAllCaches } from '../app/store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    if (!email.trim()) {
      setEmailError('Please enter an email');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Please enter a password');
      return;
    }
    try {
      resetAllCaches();
      const res = await login({ email, password }).unwrap();
      sessionStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('UserInfo', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Manager') navigate('/manager');
      else navigate('/employee');
    } catch (e: any) {
      setError(e?.data?.message || 'Login failed');
    }
  };


  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
        <Typography variant="h5" mb={2} fontWeight={600}>Welcome to Project Management System</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box display="flex" flexDirection="column" gap={2} mt={4}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth error={!!emailError} helperText={emailError || ''} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth error={!!passwordError} helperText={passwordError || ''} />
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={onLogin} disabled={isLoading} fullWidth>Sign In</Button>
            <Button component={Link} to="/register" variant="outlined" fullWidth>Register</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;


