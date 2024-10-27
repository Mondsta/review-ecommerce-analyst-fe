import React, { useState } from "react";
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
import { isNull, isUndefined } from "lodash";
import { List as ListIcon } from "@mui/icons-material";

const Try = () => {
    const { showAlert, renderAlert } = useAlert();

    const [reviewUrl, setReviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterType, setFilterType] = useState("shopee"); // New state for filter type

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
            setReviews(reviews || []);
            setReviewUrl("");
        } catch (error) {
            setIsLoading(false);
            setReviews([]);
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
            setReviews(reviews || []);
            setReviewUrl("");
        } catch (error) {
            setIsLoading(false);
            setReviews([]);
            console.log("[ERROR][mountGetScrapeDataTokopedia]", error);
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

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Typography>Review anomaly detection</Typography>

            <Paper sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            variant="outlined"
                            sx={{
                                width: "100%",
                                marginRight: { xs: 0, sm: 2 },
                            }}
                        >
                            <MenuItem value="shopee">Shopee</MenuItem>
                            <MenuItem value="tokopedia">Tokopedia</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            placeholder="Enter e-commerce URL..."
                            variant="outlined"
                            value={reviewUrl}
                            onChange={(e) => setReviewUrl(e.target.value)}
                            onKeyDown={handleKeyDownSendLink}
                            error={Boolean(urlError)}
                            helperText={urlError}
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    paddingRight: 2,
                                    paddingLeft: 2,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={
                                filterType === "shopee"
                                    ? mountGetScrapeDataShopee
                                    : mountGetScrapeDataTokopedia
                            }
                            sx={{
                                padding: "10px 24px",
                                backgroundColor: "#007bff",
                                textTransform: "none",
                            }}
                        >
                            Scrape Data
                        </Button>
                    </Grid>
                </Grid>

                {/* Review Table */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Data Scraped Reviews
                    </Typography>
                    <TableContainer
                        sx={{
                            maxHeight: 400,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                                width: "0.4em",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#f1f1f1",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#888",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                background: "#555",
                            },
                        }}
                    >
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
                                {reviews.length > 0 ? (
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
