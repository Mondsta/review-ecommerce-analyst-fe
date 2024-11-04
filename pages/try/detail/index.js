import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    Paper,
    Typography,
    Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API from "../../../services/try/tryAPI";

const DetailPage = ({ anomalyData }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!anomalyData);
    const [anomaliesData, setAnomaliesData] = useState(
        anomalyData?.anomalies || [],
    );
    const [productData, setProductData] = useState({
        product_image: "",
        product_name: "",
        total_reviews: 0,
        total_anomalies: 0,
        ...anomalyData,
    });

    const mountAnalyzeAnomalyReview = async (payload) => {
        setIsLoading(true);

        try {
            const { data } = await API.analyzeAnomalyReview(payload);
            setAnomaliesData(data.anomalies || []);
            setProductData({
                product_image: data.product_image,
                product_name: data.product_name,
                total_reviews: data.total_reviews,
                total_anomalies: data.total_anomalies,
            });
        } catch (error) {
            console.error("Error analyzing reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !anomalyData) {
            const storedPayload = localStorage.getItem("analyzePayload");
            if (storedPayload) {
                const parsedPayload = JSON.parse(storedPayload);
                console.log(
                    "Payload retrieved from localStorage:",
                    parsedPayload,
                );
                setProductData(parsedPayload);
                localStorage.removeItem("analyzePayload");
                mountAnalyzeAnomalyReview(parsedPayload);
            } else {
                setIsLoading(false);
            }
        }
    }, [anomalyData]);

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#ff5722", mb: 3 }}
            >
                Anomaly Review Detail
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <Box
                            sx={{
                                width: "50%",
                                overflow: "hidden",
                                borderRadius: 2,
                                boxShadow: 2,
                            }}
                        >
                            <img
                                src={`https://cf.shopee.co.id/file/${productData.product_image}`}
                                alt="Product"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Typography variant="h6" fontWeight="bold">
                            {productData.product_name}
                        </Typography>
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                            Total Reviews: <b>{productData.total_reviews}</b>
                        </Typography>
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                            Total Anomalies:{" "}
                            <b>{productData.total_anomalies}</b>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Anomaly Analysis Results
                </Typography>

                {anomaliesData.length === 0 ? (
                    <Typography color="textSecondary">
                        No anomalies detected.
                    </Typography>
                ) : (
                    anomaliesData.map((anomaly, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: 1,
                                    backgroundColor: anomaly.anomaly
                                        ? "#ffebee"
                                        : "#e8f5e9",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Review by {anomaly.username} - Rating:{" "}
                                    {anomaly.rating}/5
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    sx={{ mt: 1 }}
                                >
                                    Reviewed on: {anomaly.review_time}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography>{anomaly.review}</Typography>
                                <Typography
                                    color="textSecondary"
                                    sx={{ mt: 1 }}
                                >
                                    Sentiment Polarity:{" "}
                                    {anomaly.sentiment_polarity?.toFixed(2)} |
                                    Sentiment Subjectivity:{" "}
                                    {anomaly.sentiment_subjectivity?.toFixed(2)}
                                </Typography>
                                {anomaly.anomaly && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            backgroundColor: "#ffcdd2",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            fontWeight="bold"
                                        >
                                            Anomaly Detected:
                                        </Typography>
                                        <Typography variant="body2">
                                            {anomaly.conclusion}
                                        </Typography>
                                        <Typography variant="body2">
                                            Anomaly Score:{" "}
                                            {anomaly.anomaly_score?.toFixed(3)}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    ))
                )}
            </Paper>

            <Dialog fullWidth open={isLoading}>
                <DialogContent>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography
                                sx={{ mb: 1, mt: 1, fontWeight: "bold" }}
                            >
                                Please Wait
                            </Typography>
                            <CircularProgress color="primary" />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

// Server-side data fetching for Next.js
DetailPage.getInitialProps = async () => {
    return { anomalyData: null }; // Initialize with null for client-side fetching if necessary
};

export default DetailPage;
