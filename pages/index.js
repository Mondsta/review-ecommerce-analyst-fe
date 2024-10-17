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
} from "@mui/material";
import PrivateRoutes from "../utils/privateRoutes";

const Home = () => {
    const [url, setUrl] = useState("");

    const [reviews, setReviews] = useState([]);

    // POST
    async function mountGetScrapeData() {
        
    }

    // Simulasi fungsi scraping data setelah input URL
    const handleScrape = () => {
    // Misal hasil scraping berupa array objek ulasan
    const scrapedData = [
      { user: "John Doe", review: "Great product!", rating: 5 },
      {
        user: "Jane Smith",
        review: "Not bad, but could be better.",
        rating: 3,
      },
      { user: "Tom Brown", review: "Terrible experience.", rating: 1 },
    ];
    setReviews(scrapedData);
  };

  return (
    <>
      {/* Main Layout */}
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
              onClick={handleScrape}
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
                Scraped Reviews
              </Typography>
              <TableContainer component={Paper}>
                <Table>
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
                        <TableCell>{review.user}</TableCell>
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
    </>
  );
};

export default PrivateRoutes(Home);