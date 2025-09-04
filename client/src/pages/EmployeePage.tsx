import React from 'react';
import { Container, Typography } from '@mui/material';
import TaskList from './TaskList';

const EmployeePage: React.FC = () => {
  return (
    <>
      <Container>
        <Typography variant="h5" fontWeight={600} mb={2}>Employee Dashboard</Typography>
        <TaskList />
      </Container>
    </>
  );
};

export default EmployeePage;


