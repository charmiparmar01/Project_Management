import React from 'react';
import { Container, Typography } from '@mui/material';
import ProjectList from './ProjectList';

const ManagerPage: React.FC = () => {
  return (
    <>  
      <Container>
        <Typography variant="h5" fontWeight={600} mb={2}>Manager Dashboard</Typography>
        <ProjectList />
      </Container>
    </>
  );
};

export default ManagerPage;


