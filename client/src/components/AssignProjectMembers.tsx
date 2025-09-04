import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
import { useAssignProjectMemberMutation } from '../services/projectApi';
import { useGetUsersQuery } from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AssignProjectMembers: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [assignMember, { isLoading }] = useAssignProjectMemberMutation();
  const { data: usersData } = useGetUsersQuery();
  const managersAndEmployees = useMemo(() => {
    const list = ((Array.isArray((usersData as any)?.data) ? (usersData as any).data : (Array.isArray(usersData) ? usersData : [])) as any[]);
    return list.filter(u => ['Manager', 'Employee'].includes(((u.roleId && (u.roleId as any).roleName) || (u.role?.roleName) || u.role)));
  }, [usersData]);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (userIds.length === 0) { setError('Please select at least one member'); return; }
    try {
      await Promise.all(userIds.map(uid => assignMember({ id: id as string, userId: uid }).unwrap()));
      setUserIds([]);
      navigate('/projects-list');
    } catch (error: any) {
      console.error('Failed to assign members:', error);
      if (error?.data?.message) {
        setError(error.data.message);
      } else {
        setError('Failed to assign members. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Assign Project Member</Typography>
          <Box display="flex" gap={2}>
            <TextField select SelectProps={{ multiple: true }} label="Members" value={userIds} onChange={(e) => setUserIds(typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))} fullWidth>
              {managersAndEmployees.map((u) => (
                <MenuItem key={u._id || u.id} value={u._id || u.id}>{u.username} ({u.roleId?.roleName || u.role?.roleName || u.role})</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Assign</Button>
          </Box>
          {error && <Typography color="error" mt={1}>{error}</Typography>}
        </Paper>
      </Container>
    </>
  );
};

export default AssignProjectMembers;


