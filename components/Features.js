import React from "react";
import { Box, Typography, Grid, Card, CardContent, Icon, Container } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";

const features = [
  {
    icon: <CloudDownloadIcon sx={{ color: "white" }}/>,
    title: "Web Scraping",
    description: "Automated data extraction from e-commerce platforms.",
  },
  {
    icon: <SettingsIcon sx={{ color : "white" }}/>,
    title: "Data Processing",
    description: "Efficient processing of collected data for analysis.",
  },
  {
    icon: <VisibilityIcon sx={{ color : "white" }}/>,
    title: "Anomaly Detection",
    description: "Isolation Forest algorithm to detect unusual patterns in reviews.",
  },
];

const Features = () => {
  return (
    <Box bgcolor={"black"} color={"white"} sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom align="center">
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  bgcolor: "#333",
                  color: "white",
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon color="primary" sx={{ fontSize: 50, mb: 1 }}>
                    {feature.icon}
                  </Icon>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;