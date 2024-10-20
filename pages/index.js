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
} from "@mui/material";
import PrivateRoutes from "../utils/privateRoutes";
import useAlert from "../utils/alert";
import API from "../services/try/tryAPI";
import { isNull, isUndefined } from "lodash";

const Home = () => {
  const { showAlert, renderAlert } = useAlert();

  const [reviewUrl, setReviewUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // POST
  async function mountGetScrapeData() {
    if (!isValidUrl(reviewUrl)) {
        setUrlError("Link tidak valid. Silakan masukkan link Shopee atau Tokopedia.");
        showAlert("error", "Link tidak valid");
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
      } else {
        setIsLoading(false);
        setReviews(reviews);
      }
    } catch (error) {
      setIsLoading(false);
      setReviews([]);
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
              helperText={urlError} // Tampilkan pesan error
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
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6" gutterBottom>
                Data Scraped Reviews
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 400, overflowY: "auto" }}
              >
                <Table stickyHeader>
                  {" "}
                  {/* Tambahkan stickyHeader jika ingin header tetap di atas saat scroll */}
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Review</TableCell>
                      <TableCell>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.map((review, index) => (
                      <TableRow key={index}>
                        <TableCell>{review.username}</TableCell>
                        <TableCell>{review.review}</TableCell>
                        <TableCell>{review.rating}</TableCell>
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

export default PrivateRoutes(Home);
