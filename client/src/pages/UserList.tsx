import React, { useEffect } from 'react';
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Stack } from '@mui/material';
import { useGetUsersQuery, useDeleteUserMutation } from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserList: React.FC = () => {
  const { data, isLoading, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
    <Navbar />
    <Container>
      <Paper>
        {isLoading ? (
          <CircularProgress sx={{ m: 2 }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {((Array.isArray((data as any)?.data) ? (data as any).data : (Array.isArray(data) ? data : [])) as any[]).map((u: any) => (
                <TableRow key={u.id || u._id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.roleId?.roleName}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="outlined" onClick={() => navigate(`/edit-user/${u._id || u.id}`)}>Edit</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          deleteUser(u._id || u.id);
                        }
                      }}>Delete</Button>
                      <Button size="small" variant="contained" onClick={() => navigate(`/assign-role/${u._id || u.id}`)}>Change Role</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
    </>
  );
};

export default UserList;


