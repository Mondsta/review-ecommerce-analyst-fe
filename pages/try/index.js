import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Dialog,
    DialogContent,
    CircularProgress,
    Select,
    MenuItem,
} from "@mui/material";
import PrivateRoutes from "../../utils/privateRoutes";
import useAlert from "../../utils/alert";
import API from "../../services/try/tryAPI";

const Try = () => {
    const { showAlert, renderAlert } = useAlert();

    const [reviewUrl, setReviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");

    const [reviews, setReviews] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [filterType, setFilterType] = useState("shopee");

    // POST
    async function mountGetScrapeDataShopee() {
        if (!isValidUrl(reviewUrl, "shopee")) {
            setUrlError("Link tidak valid. Silakan masukkan link Shopee.");
            showAlert("error", "Link tidak valid");
            setReviews([]);
            return;
        }

        setIsLoading(true);
        var payload = { url: reviewUrl };

        try {
            const GetScrapingDataShopee =
                await API.getScrapeDataShopee(payload);
            const { reviews } = GetScrapingDataShopee.data;
            console.log("Scrape Data Shopee", reviews);

            setIsLoading(false);
            setReviews(reviews);
            setReviewUrl("");
        } catch (error) {
            setIsLoading(false);
            setReviews([]);
            showAlert("error", "Silakan coba kembali");
            console.log("[ERROR][mountGetScrapeDataShopee]", error);
        }
    }

    async function mountGetScrapeDataTokopedia() {
        if (!isValidUrl(reviewUrl, "tokopedia")) {
            setUrlError("Link tidak valid. Silakan masukkan link Tokopedia.");
            showAlert("error", "Link tidak valid");
            setReviews([]);
            return;
        }

        setIsLoading(true);
        var payload = { url: reviewUrl };

        try {
            const GetScrapingDataTokopedia =
                await API.getScrapeDataTokopedia(payload);
            const { reviews } = GetScrapingDataTokopedia.data;
            console.log("Scrape Data Tokopedia", reviews);

            setIsLoading(false);
            setReviews(reviews);
            setReviewUrl("");
        } catch (error) {
            setIsLoading(false);
            setReviews([]);
            showAlert("error", "Silakan coba kembali");
            console.log("[ERROR][mountGetScrapeDataTokopedia]", error);
        }
    }

    async function mountCleanReviewsData() {
        if (!reviews || reviews.length === 0) {
            showAlert("error", "Tidak ada data review untuk diproses.");
            return;
        }

        setIsLoading(true);

        var payload = {
            product_name: "No product name found",
            total_reviews: reviews.length,
            reviews: reviews.map((review) => ({
                rating: review.rating,
                review: review.review,
                review_time: review.review_time,
                username: review.username,
            })),
        };

        try {
            const cleanedDataResponse = await API.cleanReviewsData(payload);
            console.log("Response from API:", cleanedDataResponse);
            const cleanedReviews = cleanedDataResponse.data.cleaned_reviews;
            console.log("Cleaned Reviews Data", cleanedReviews);

            setIsLoading(false);
            setReviews(cleanedReviews);
            showAlert("success", "Data berhasil diproses.");
        } catch (error) {
            setIsLoading(false);
            showAlert(
                "error",
                "Terjadi kesalahan saat memproses data. Silakan coba kembali.",
            );
            console.log("[ERROR][mountCleanReviewsData]", error);
        }
    }

    // Update validation to check the filter type
    const isValidUrl = (url, type) => {
        const shopeeRegex = /^https:\/\/shopee\.co\.id\/.+$/;
        const tokopediaRegex = /^https:\/\/www\.tokopedia\.com\/.+$/;
        return type === "shopee"
            ? shopeeRegex.test(url)
            : tokopediaRegex.test(url);
    };

    const handleKeyDownSendLink = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (filterType === "shopee") {
                mountGetScrapeDataShopee();
            } else {
                mountGetScrapeDataTokopedia();
            }
        }
    };

    const clearReviewData = () => {
        setReviews([]);
        setReviewUrl("");
        setUrlError("");
        showAlert("success", "Data reviews berhasil dihapus");
    };

    // Reset urlError if reviewUrl or filterType changes
    useEffect(() => {
        if (isValidUrl(reviewUrl, filterType)) {
            setUrlError("");
        }
    }, [reviewUrl, filterType]);

    // useEffect(() => {
    //     console.log("Updated Reviews State after clean:", reviews);
    //  }, [reviews]);

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Typography>E-commerce Anomaly Review Detection</Typography>

            <Paper sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: 3,
                                height: 48,
                            }}
                        >
                            <MenuItem value="shopee">Shopee</MenuItem>
                            <MenuItem value="tokopedia">Tokopedia</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Box sx={{ position: "relative", width: "100%" }}>
                            <TextField
                                fullWidth
                                placeholder="Enter e-commerce URL..."
                                variant="outlined"
                                value={reviewUrl}
                                onChange={(e) => setReviewUrl(e.target.value)}
                                onKeyDown={handleKeyDownSendLink}
                                error={Boolean(urlError)}
                                sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: 3,
                                    "& .MuiOutlinedInput-root": {
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                        height: 48,
                                        borderRadius: 3,
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "12px 14px",
                                        borderRadius: 3,
                                    },
                                }}
                            />
                            {urlError && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        mt: "4px",
                                    }}
                                >
                                    {urlError}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={
                                filterType === "shopee"
                                    ? mountGetScrapeDataShopee
                                    : mountGetScrapeDataTokopedia
                            }
                            fullWidth
                            sx={{
                                backgroundColor: "#007bff",
                                textTransform: "none",
                                height: 48,
                                maxWidth: "100%",
                                borderRadius: 3,
                            }}
                        >
                            Scrape Data
                        </Button>
                    </Grid>
                </Grid>

                {/* Conditionally Render Clear Data Button */}
                {Array.isArray(reviews) && reviews.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={clearReviewData}
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    height: 48,
                                    maxWidth: "100%",
                                    borderRadius: 3,
                                }}
                            >
                                Clear Data
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={mountCleanReviewsData}
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    height: 48,
                                    maxWidth: "100%",
                                    borderRadius: 3,
                                }}
                            >
                                Data Processing
                            </Button>
                        </Grid>
                    </Grid>
                )}

                {/* Review Table */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Data Scraped Reviews
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Total Reviews: <b>{reviews ? reviews.length : 0}</b>
                    </Typography>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Review</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(reviews) &&
                                reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {review.username}
                                            </TableCell>
                                            <TableCell>
                                                {review.review}
                                            </TableCell>
                                            <TableCell>
                                                {review.rating}
                                            </TableCell>
                                            <TableCell>
                                                {review.review_time}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

            {/* MODAL LOADING */}
            <Dialog fullWidth open={isLoading}>
                <DialogContent>
                    <Grid container>
                        <Grid item xs></Grid>
                        <Grid item xs={8} sx={{ textAlign: "center" }}>
                            <Typography sx={{ mb: 1, mt: 1 }}>
                                Please Wait
                            </Typography>
                            <CircularProgress />
                        </Grid>
                        <Grid item xs></Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* ALERT NOTIFICATION */}
            {renderAlert()}
        </Box>
    );
};

export default PrivateRoutes(Try);
