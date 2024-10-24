import React from "react";
import { Box, Typography, Grid, Card, CardContent, Icon } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import WifiIcon from "@mui/icons-material/Wifi";

const features = [
  {
    icon: <BoltIcon />,
    title: "Fast Processing",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  {
    icon: <BatteryFullIcon />,
    title: "Low Power Consuming",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  {
    icon: <WifiIcon />,
    title: "Wifi Compatibility",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
];

const Features = () => {
  return (
    <Box sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Icon color="primary">{feature.icon}</Icon>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;