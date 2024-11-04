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
import * as XLSX from "xlsx";
import { setStorage } from "../../utils/storage";

const Try = () => {
    const { showAlert, renderAlert } = useAlert();

    const [reviewUrl, setReviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");
    const [productName, setProductName] = useState("");
    const [productImage, setProductImage] = useState("");

    const [reviews, setReviews] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

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
            const { product_name, product_image, reviews } =
                GetScrapingDataShopee.data;
            console.log("Scrape Data Shopee", reviews);
            console.log("Shopee API response:", GetScrapingDataShopee.data);

            setIsLoading(false);
            setReviews(reviews);
            setProductName(product_name);
            setProductImage(product_image);
            setReviewUrl(reviewUrl);
            setIsProcessed(true);
            setIsAnalyzed(false);
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
            setProductName(product_name);
            setProductImage(product_image);
            setReviewUrl(reviewUrl);
            setIsProcessed(false);
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
            product_name: productName,
            product_image: productImage,
            reviews: reviews.map((review) => ({
                rating: review.rating,
                review: review.review,
                review_time: review.review_time,
                username: review.username,
            })),
            total_reviews: reviews.length,
        };

        try {
            const cleanedDataResponse = await API.cleanReviewsData(payload);
            console.log("Response from API:", cleanedDataResponse);
            const cleanedReviews = cleanedDataResponse.data;
            console.log("Cleaned Reviews Data", cleanedReviews);

            setIsLoading(false);
            setReviews(cleanedReviews.reviews);
            setIsProcessed(true);
            setIsAnalyzed(true);
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

    async function mountAnalyzeAnomalyReview() {
        if (!reviews || reviews.length === 0) {
            showAlert("error", "Tidak ada data review untuk diproses.");
            return;
        }

        const payload = {
            product_name: productName,
            product_image: productImage,
            reviews: reviews.map((review) => ({
                rating: review.rating,
                review: review.review,
                review_time: review.review_time,
                username: review.username,
            })),
            total_reviews: reviews.length,
        };

        // Store the payload in localStorage
        localStorage.setItem("analyzePayload", JSON.stringify(payload));
        setStorage("payload", JSON.stringify(payload));

        // Open a new tab with the detail page URL
        window.open(`/try/detail`, "_blank");
    }

    // Download file Excel and CSV
    const downloadExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const downloadCSV = (data, fileName) => {
        const csv = data.map((row) => Object.values(row).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

    const handleDetectAnomalyClick = async () => {
        await mountAnalyzeAnomalyReview();
    };

    const clearReviewData = () => {
        setReviews([]);
        setProductName("");
        setProductImage("");
        setReviewUrl("");
        setUrlError("");
        setIsProcessed(false);
        setIsAnalyzed(false);
        showAlert("success", "Data reviews berhasil dihapus");
    };

    // Reset urlError if reviewUrl or filterType changes
    useEffect(() => {
        if (isValidUrl(reviewUrl, filterType)) {
            setUrlError("");
        }
    }, [reviewUrl, filterType]);

    return (
        <Box
            sx={{
                width: "100%",
                p: 2,
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    color: filterType === "shopee" ? "#ff5722" : "#2DBE60",
                    mb: 2,
                }}
            >
                E-commerce Anomaly Review Detection
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: "#fff",
                                transition: "background-color 0.3s ease",
                                borderRadius: 3,
                                height: 48,
                                "& .MuiOutlinedInput-root": {
                                    color:
                                        filterType === "shopee"
                                            ? "#ff5722"
                                            : "#2DBE60",
                                },
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
                                        "&:hover": {
                                            borderColor:
                                                filterType === "shopee"
                                                    ? "#ff5722"
                                                    : "#2DBE60",
                                        },
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
                            onClick={
                                filterType === "shopee"
                                    ? mountGetScrapeDataShopee
                                    : mountGetScrapeDataTokopedia
                            }
                            fullWidth
                            sx={{
                                backgroundColor:
                                    filterType === "shopee"
                                        ? "#ff5722"
                                        : "#2DBE60",
                                color: "#fff",
                                textTransform: "none",
                                height: 48,
                                maxWidth: "100%",
                                borderRadius: 3,
                                "&:hover": {
                                    backgroundColor:
                                        filterType === "shopee"
                                            ? "#e64a19"
                                            : "#24984a",
                                },
                            }}
                        >
                            Scrape Data
                        </Button>
                    </Grid>
                </Grid>

                {Array.isArray(reviews) && reviews.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="outlined"
                                onClick={clearReviewData}
                                fullWidth
                                sx={{
                                    borderColor:
                                        filterType === "shopee"
                                            ? "#ff5722"
                                            : "#2DBE60",
                                    color:
                                        filterType === "shopee"
                                            ? "#ff5722"
                                            : "#2DBE60",
                                    textTransform: "none",
                                    height: 48,
                                    maxWidth: "100%",
                                    borderRadius: 3,
                                    "&:hover": {
                                        backgroundColor:
                                            filterType === "shopee"
                                                ? "#ffccbc"
                                                : "#a5e6c8",
                                    },
                                }}
                            >
                                Clear Data
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {isAnalyzed ? (
                                <Button
                                    variant="contained"
                                    onClick={handleDetectAnomalyClick}
                                    fullWidth
                                    sx={{
                                        backgroundColor:
                                            filterType === "shopee"
                                                ? "#ff5722"
                                                : "#2DBE60",
                                        textTransform: "none",
                                        height: 48,
                                        maxWidth: "100%",
                                        borderRadius: 3,
                                        "&:hover": {
                                            backgroundColor:
                                                filterType === "shopee"
                                                    ? "#e64a19"
                                                    : "#24984a",
                                        },
                                    }}
                                >
                                    Detect Anomaly Reviews
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={mountCleanReviewsData}
                                    fullWidth
                                    sx={{
                                        backgroundColor:
                                            filterType === "shopee"
                                                ? "#ff5722"
                                                : "#2DBE60",
                                        textTransform: "none",
                                        height: 48,
                                        maxWidth: "100%",
                                        borderRadius: 3,
                                        "&:hover": {
                                            backgroundColor:
                                                filterType === "shopee"
                                                    ? "#e64a19"
                                                    : "#24984a",
                                        },
                                    }}
                                >
                                    Data Processing
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                )}

                <Box mt={4}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color:
                                filterType === "shopee" ? "#ff5722" : "#2DBE60",
                            fontWeight: "bold",
                        }}
                    >
                        {isProcessed
                            ? "Processed Reviews Data"
                            : "Data Scraped Reviews"}
                    </Typography>

                    {/* Product Name */}
                    <Typography>Product Name: {productName}</Typography>

                    {/* Product Image */}
                    {productImage && (
                        <Box
                            sx={{
                                width: "200px",
                                height: "200px",
                                overflow: "hidden",
                                borderRadius: 2,
                                boxShadow: 2,
                                mr: 2,
                            }}
                        >
                            <img
                                src={`https://cf.shopee.co.id/file/${productImage}`}
                                alt="productImage"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    )}

                    <Grid item xs={6}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontSize: "0.875rem" }}
                        >
                            Total Reviews: <b>{reviews ? reviews.length : 0}</b>
                        </Typography>
                    </Grid>

                    {/* Button Row for Total Reviews and Download Buttons */}
                    {isProcessed && (
                        <Grid
                            container
                            spacing={2}
                            sx={{ mt: 2, alignItems: "center" }}
                        >
                            <Grid item xs={6}></Grid>

                            {/* Download Buttons */}
                            <Grid
                                item
                                xs={6}
                                container
                                spacing={2}
                                justifyContent="flex-end"
                            >
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            downloadExcel(
                                                reviews,
                                                "cleaned_reviews",
                                            )
                                        }
                                        sx={{
                                            backgroundColor:
                                                filterType === "shopee"
                                                    ? "#ff5722"
                                                    : "#2DBE60",
                                            color: "#ffffff",
                                            textTransform: "none",
                                            height: 36, // Reduced height
                                            borderRadius: 3,
                                            "&:hover": {
                                                backgroundColor:
                                                    filterType === "shopee"
                                                        ? "#ffccbc"
                                                        : "#a5e6c8",
                                            },
                                        }}
                                    >
                                        Download Excel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            downloadCSV(
                                                reviews,
                                                "cleaned_reviews",
                                            )
                                        }
                                        sx={{
                                            backgroundColor:
                                                filterType === "shopee"
                                                    ? "#ff5722"
                                                    : "#2DBE60",
                                            color: "#ffffff",
                                            textTransform: "none",
                                            height: 36, // Reduced height
                                            borderRadius: 3,
                                            "&:hover": {
                                                backgroundColor:
                                                    filterType === "shopee"
                                                        ? "#ffccbc"
                                                        : "#a5e6c8",
                                            },
                                        }}
                                    >
                                        Download CSV
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    <TableContainer
                        sx={{ mt: 2, borderRadius: 4, boxShadow: 1 }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <b>Username</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Review</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>Rating</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Date</b>
                                    </TableCell>
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: "250px",
                                                        wordBreak: "break-word",
                                                        whiteSpace: "pre-wrap",
                                                    }}
                                                >
                                                    {review.review}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
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

                {/* Modal Loading */}
                <Dialog fullWidth open={isLoading}>
                    <DialogContent>
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
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
            </Paper>
        </Box>
    );
};

export default PrivateRoutes(Try);
