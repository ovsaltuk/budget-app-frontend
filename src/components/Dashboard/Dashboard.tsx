import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать, {user?.login}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Name: {user?.login}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {user?.email}
      </Typography>
      <Button 
        variant="outlined" 
        onClick={logout}
        sx={{ mt: 2 }}
      >
        Выйти
      </Button>
    </Box>
  );
};

export default Dashboard;