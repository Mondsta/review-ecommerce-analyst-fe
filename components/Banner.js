import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

const Banner = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h2" gutterBottom>
            Best App Website Template
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur hendrerit neque massa, sit amet tristique ante porta ut.
          </Typography>
          <Button variant="contained" color="secondary">Get Started</Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <img src="/images/iphone-screen.png" alt="App Screen" style={{ width: '100%' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Banner;