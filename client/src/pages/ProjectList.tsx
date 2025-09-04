import React from 'react';
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Stack } from '@mui/material';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../services/projectApi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProjectList: React.FC = () => {
  const { data, isLoading } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('UserInfo') || 'null')?.role;

  return (
    <>
    <Navbar />
    <Container>
      <Paper sx={{ p: 2 }}>
        {userRole !== 'Employee' && (
          <Stack direction="row" justifyContent="flex-end" mb={1}>
            <Button size="small" variant="contained" onClick={() => navigate('/create-project')}>Create Project</Button>
          </Stack>
        )}
        {isLoading ? (
          <CircularProgress sx={{ m: 2 }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {((Array.isArray((data as any)?.data) ? (data as any).data : (Array.isArray(data) ? data : [])) as any[]).map((p: any) => (
                <TableRow key={p.id || p._id}>
                  <TableCell>{p.projectName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {userRole !== 'Employee' && (
                        <>
                          <Button size="small" variant="outlined" onClick={() => navigate(`/edit-project/${p._id || p.id}`)}>Edit</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => {
                            if (window.confirm('Are you sure you want to delete this project?')) {
                              deleteProject(p._id || p.id);
                            }
                          }}>Delete</Button>
                          <Button size="small" variant="contained" onClick={() => navigate(`/assign-project-members/${p._id || p.id}`)}>Assign Members</Button>
                        </>
                      )}
                      <Button size="small" onClick={() => navigate(`/projects/${p._id || p.id}/tasks`)}>View Tasks</Button>
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

export default ProjectList;


