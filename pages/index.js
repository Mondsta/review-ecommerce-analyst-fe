import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const Introduction = () => {

  const router = useRouter();

  const handleTryClick = () => {
    router.push("/try");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "black",
        color: "text.primary",
        px: 3,
      }}
    >
      <Grid container spacing={2} sx={{ maxWidth: "lg", margin: "0 auto" }}>
        <Grid item xs={12}>
          <Typography variant="h6" color="white" gutterBottom>
            2 October, 2024
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            Introducing E-commerce Anomaly Reviews Analyst
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            alignItems="center"
            color="primary"
            size="large"
            onClick={handleTryClick}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
            }}
          >
            Try Application
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Introduction />
      <Banner />
      <Features />
      <Footer />
    </>
  );
}
