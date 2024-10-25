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
  Drawer,
} from "@mui/material";
import PrivateRoutes from "../../utils/privateRoutes";
import useAlert from "../../utils/alert";
import API from "../../services/try/tryAPI";
import { isNull, isUndefined } from "lodash";
import { List as ListIcon, Menu as MenuIcon } from "@mui/icons-material";

const Try = () => {
  const { showAlert, renderAlert } = useAlert();

  const [reviewUrl, setReviewUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // POST
  async function mountGetScrapeData() {
    if (!isValidUrl(reviewUrl)) {
      setUrlError(
        "Link tidak valid. Silakan masukkan link Shopee atau Tokopedia.",
      );
      showAlert("error", "Link tidak valid");
      setReviews([]);
      return;
    }

    setIsLoading(true);

    var payload = {
      url: reviewUrl,
    };

    try {
      const GetScrapingData = await API.getScrapeData(payload);
      const { reviews } = GetScrapingData.data;

      console.log("Scrape Data", reviews);

      if (isNull(reviews) || isUndefined(reviews)) {
        setIsLoading(false);
        setReviews([]);
        setReviewUrl([]);
      } else {
        setIsLoading(false);
        setReviews(reviews);
        setReviewUrl([]);
      }
    } catch (error) {
      setIsLoading(false);
      setReviews([]);
      setReviewUrl([]);
      console.log("[ERROR][mountGetScrapeData]", error);
    }
  }

  const isValidUrl = (url) => {
    const shopeeRegex = /^https:\/\/shopee\.co\.id\/.+$/;
    const tokopediaRegex = /^https:\/\/www\.tokopedia\.com\/.+$/;
    return shopeeRegex.test(url) || tokopediaRegex.test(url);
  };

  return (
    <>
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box
          sx={{
            width: 250,
            p: 2,
            bgcolor: "#1f1f1f",
            color: "#fff",
            height: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <Button
            startIcon={<ListIcon />}
            fullWidth
            sx={{ color: "#fff", justifyContent: "flex-start" }}
          >
            Dashboard
          </Button>
          <Button
            startIcon={<ListIcon />}
            fullWidth
            sx={{ color: "#fff", justifyContent: "flex-start" }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        {/* Input Field Area */}
        <Grid item xs={6}>
          <Box
            component={Paper}
            elevation={3}
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              position: "fixed",
              bottom: 0,
              left: 0,
              bgcolor: "#f6f6f6",
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter e-commerce URL..."
              variant="outlined"
              value={reviewUrl}
              onChange={(e) => setReviewUrl(e.target.value)}
              error={Boolean(urlError)} // Tambahkan error prop jika ada pesan error
              helperText={urlError} // Tampilkan pesan error di textfield
              sx={{
                marginRight: 2,
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  paddingRight: 2,
                  paddingLeft: 2,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={mountGetScrapeData}
              sx={{
                padding: "10px 24px",
                backgroundColor: "#007bff",
                textTransform: "none",
              }}
            >
              Scrape Data
            </Button>
          </Box>

          {/* Review Table */}
          {reviews.length > 0 && (
            <Box>
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
                  {" "}
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Review</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.map((review, index) => (
                      <TableRow key={index}>
                        <TableCell>{review.username}</TableCell>
                        <TableCell>{review.review}</TableCell>
                        <TableCell>{review.rating}</TableCell>
                        <TableCell>{review.review_time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>
      {/* MODAL LOADING */}
      <Dialog fullWidth open={isLoading}>
        <DialogContent>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item xs={8} sx={{ textAlign: "center" }}>
              <Typography sx={{ mb: 1, mt: 1 }}>Please Wait</Typography>
              <CircularProgress />
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* ALERT NOTIFICATION */}
      {renderAlert()}
    </>
  );
};

export default PrivateRoutes(Try);
