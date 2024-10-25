import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Slide, useScrollTrigger } from '@mui/material';

// Helper function to hide the AppBar on scroll down and show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <HideOnScroll>
      <AppBar position="fixed" sx={{ backgroundColor: 'black', transition: 'background-color 0.3s ease' }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 10%' }}>
          <Typography variant="h6" component="div" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            E-commerce Anomaly Review Detection System
          </Typography>

          <Box>
            <Button color="inherit" sx={{ color: '#ffffff', fontSize: '16px' }}>
              Home
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;