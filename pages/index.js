import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const Introduction = () => {
    const router = useRouter();

    const handleTryClick = () => {
        window.open("/try");
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
            <Grid container spacing={2} sx={{ maxWidth: "lg" }}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="white" gutterBottom>
                        2 October, 2024
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="white"
                        gutterBottom
                    >
                        Introducing E-commerce Anomaly Review Detection System
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
                        color="inherit"
                        size="medium"
                        onClick={handleTryClick}
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            px: 3,
                            py: 1,
                            borderRadius: "50px",
                            "&:hover": {},
                        }}
                    >
                        Try Application
                        <ArrowOutwardIcon sx={{ ml: 1 }} />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="body1"
                        color="white"
                        gutterBottom
                        textAlign={"left"}
                    >
                        We’ve developed an application designed to detect
                        anomalous reviews on e-commerce platforms using the
                        Isolation Forest algorithm. This system is built to
                        automatically identify suspicious reviews that deviate
                        from common patterns, helping users gain deeper insights
                        into the authenticity of product feedback.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="body1"
                        color="white"
                        gutterBottom
                        textAlign={"left"}
                    >
                        Our application integrates web scraping techniques to
                        gather product reviews, process the data, and apply
                        Isolation Forest for anomaly detection. It aims to
                        enhance consumer trust, protect seller reputations, and
                        support more informed purchasing decisions.
                    </Typography>
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
            <Features />
            <Footer />
        </>
    );
}
