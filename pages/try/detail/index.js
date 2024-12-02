import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogActions,
    Grid,
    Paper,
    Typography,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"; // Ikon sorting
import API from "../../../services/try/tryAPI";

const DetailPage = ({ anomalyData }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!anomalyData);
    const [anomaliesData, setAnomaliesData] = useState(
        anomalyData?.anomalies || [],
    );
    const [filteredAnomalies, setFilteredAnomalies] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [sortDirection, setSortDirection] = useState("desc"); // Default descending
    const [totalFilteredReviews, setTotalFilteredReviews] = useState(0); // Total filtered reviews
    const [productData, setProductData] = useState({
        product_image: "",
        product_name: "",
        total_reviews: 0,
        total_anomalies: 0,
        accuracy: 0,
        classification_report: "",
        confusion_matrix: [],
        ...anomalyData,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog for analysis report
    const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(isLoading); // Dialog for Please Wait

    const mountAnalyzeAnomalyReview = async (payload) => {
        setIsLoading(true);
        setIsLoadingDialogOpen(true);
        try {
            const { data } = await API.analyzeAnomalyReview(payload);
            setAnomaliesData(data.anomalies || []);
            setFilteredAnomalies(data.anomalies || []); // Update filtered data
            setProductData({
                product_image: data.product_image,
                product_name: data.product_name,
                total_reviews: data.total_reviews,
                total_anomalies: data.total_anomalies,
                accuracy: data.accuracy,
                classification_report: data.classification_report,
                confusion_matrix: data.confusion_matrix,
            });
        } catch (error) {
            console.error("Error analyzing reviews:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingDialogOpen(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !anomalyData) {
            const storedPayload = localStorage.getItem("analyzePayload");
            if (storedPayload) {
                const parsedPayload = JSON.parse(storedPayload);
                setProductData(parsedPayload);
                localStorage.removeItem("analyzePayload");
                mountAnalyzeAnomalyReview(parsedPayload);
            } else {
                setIsLoading(false);
                setIsLoadingDialogOpen(false);
            }
        }
    }, [anomalyData]);

    // Update filtered anomalies based on selected filter type
    useEffect(() => {
        let filtered = anomaliesData;

        if (filterType === "positive") {
            filtered = anomaliesData.filter((anomaly) => anomaly.rating >= 4);
        } else if (filterType === "negative") {
            filtered = anomaliesData.filter((anomaly) => anomaly.rating < 4);
        }

        setFilteredAnomalies(filtered);
        setTotalFilteredReviews(filtered.length); // Update total reviews count
    }, [filterType, anomaliesData]);

    // Handle sorting by anomaly score
    const handleSortByScore = () => {
        const sorted = [...filteredAnomalies].sort((a, b) =>
            sortDirection === "asc"
                ? a.anomaly_score - b.anomaly_score
                : b.anomaly_score - a.anomaly_score,
        );
        setFilteredAnomalies(sorted);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

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

            {/* Product Detail Section */}
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
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                            Accuracy:{" "}
                            <b>{(productData.accuracy * 100).toFixed(2)}%</b>
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, backgroundColor: "#ff5722" }}
                            onClick={() => setIsDialogOpen(true)}
                        >
                            View Analysis Report
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Filter & Sorting Section */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Filter Anomalies
                </Typography>
                <ToggleButtonGroup
                    value={filterType}
                    exclusive
                    onChange={(e, newFilterType) =>
                        setFilterType(newFilterType || "all")
                    }
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="positive">Positive</ToggleButton>
                    <ToggleButton value="negative">Negative</ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ flexGrow: 1 }}>
                        Total Reviews: <b>{totalFilteredReviews}</b>
                    </Typography>
                    <IconButton onClick={handleSortByScore}>
                        {sortDirection === "asc" ? (
                            <ArrowUpward />
                        ) : (
                            <ArrowDownward />
                        )}
                    </IconButton>
                    <Typography>Sort by Score</Typography>
                </Box>

                {/* Anomalies List */}
                {filteredAnomalies.length === 0 ? (
                    <Typography color="textSecondary">
                        No anomalies detected.
                    </Typography>
                ) : (
                    filteredAnomalies.map((anomaly, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: 1,
                                    backgroundColor:
                                        anomaly.rating >= 4
                                            ? "#e8f5e9"
                                            : "#ffebee",
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
                                {anomaly.anomaly && (
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            backgroundColor:
                                                anomaly.rating >= 4
                                                    ? "#c8f7cc"
                                                    : "#ffcdd2",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
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

            {/* Dialog: Analysis Report */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Analysis Report
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Accuracy: {(productData.accuracy * 100).toFixed(2)}%
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ mt: 2 }}
                        fontWeight="bold"
                    >
                        Classification Report
                    </Typography>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                        }}
                    >
                        {productData.classification_report}
                    </pre>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        color="primary"
                        sx={{ color: "#ff5722" }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Please Wait */}
            <Dialog open={isLoadingDialogOpen}>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 3,
                        }}
                    >
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Please Wait...</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default DetailPage;
