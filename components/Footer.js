import React from 'react';
import { Box, Typography, Link, Grid, IconButton } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 4,
        bgcolor: 'black',
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        {/* Left Section: Links */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center', md: { justifyContent: 'start' } }}>
            <Link href="/terms" color='white' underline="none" sx={{ mx: 2 }}>
              Terms of Service
            </Link>
            <Link href="/privacy" color='white' underline="none" sx={{ mx: 2 }}>
              Privacy Policy
            </Link>
            <Link href="/contact" color='white' underline="none" sx={{ mx: 2 }}>
              Contact Us
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Bottom: Credits */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color='white'>
          &copy; 2024 E-commerce Review Analyst.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;