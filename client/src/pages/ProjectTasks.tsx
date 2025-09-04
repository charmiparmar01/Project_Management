import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Stack} from '@mui/material';
import { useGetTasksQuery, useDeleteTaskMutation } from '../services/taskApi';
import Navbar from '../components/Navbar';

const ProjectTasks: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('UserInfo') || 'null')?.role;

  const tasks = ((Array.isArray((data as any)?.data) ? (data as any).data : (Array.isArray(data) ? data : [])) as any[])
    .filter((t: any) => (t.projectId?._id || t.projectId) === id);

  return (
    <>
      <Navbar />
      <Container>
        <Paper sx={{ p: 2 }}>
          {userRole !== 'Employee' && (
            <Stack direction="row" justifyContent="flex-end" mb={1}>
              <Button size="small" variant="contained" onClick={() => navigate('/create-task')}>Create Task</Button>
            </Stack>
          )}
          {isLoading ? (
            <CircularProgress sx={{ m: 2 }} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((t: any) => (
                  <TableRow key={t.id || t._id}>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {userRole !== 'Employee' && (
                          <>
                            <Button size="small" variant="outlined" onClick={() => navigate(`/edit-task/${t._id || t.id}`)}>Edit</Button>
                            <Button size="small" color="error" variant="outlined" onClick={() => { if (window.confirm('Are you sure you want to delete this task?')) { deleteTask(t._id || t.id); } }}>Delete</Button>
                            <Button size="small" variant="contained" onClick={() => navigate(`/assign-task/${t._id || t.id}`)}>Assign</Button>
                          </>
                        )}
                        <Button size="small" onClick={() => navigate(`/update-status/${t._id || t.id}`)}>Change Status</Button>
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

export default ProjectTasks;


