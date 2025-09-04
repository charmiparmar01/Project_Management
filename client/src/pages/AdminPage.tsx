import React from 'react';
import { Container } from '@mui/material';
import UserList from './UserList';

const AdminPage: React.FC = () => {
  return (
    <>
      <Container>
        <UserList />
      </Container>
    </>
  );
};

export default AdminPage;


