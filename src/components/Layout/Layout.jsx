import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // Chiều cao của Navbar
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 