import React, { useState, useEffect } from "react";
import Head from "next/head";

import { Box, styled } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import store from "../redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getToken } from "../utils/token";
import { ThemeConfig } from "../themes";

import PropTypes from "prop-types";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  padding: 0, // Set padding to 0
  minHeight: "100vh",
  backgroundColor: "#F5F5F5", // Background color for content
  flexGrow: 1,
  overflow: "hidden",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${theme.spacing(30)}`, // Assuming a 240px sidebar width
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
  router,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevOpen) => !prevOpen);
  };

  // This ensures the code only runs on client-side (for token checks)
  const isAuthenticated = typeof window !== "undefined" && getToken("token");

  return (
    mounted && (
      <>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, width=device-width"
            />
            <meta name="googlebot" content="noindex" />
            <meta name="robots" content="noindex" />
            <title>E-commerce Review Analyst</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Provider store={store}>
            <ThemeConfig>
              <Toaster position="top-center" reverseOrder={false} gutter={8} />
              {/* Render the login page if the path is "/login" or if the user is not authenticated */}
              {router.pathname === "/login" || !isAuthenticated ? (
                <Component {...pageProps} />
              ) : (
                <Box display="flex">
                  {/* <Sidebar open={isSidebarOpen} /> */}
                  <Box sx={{ width: "100%" }}>
                    {/* <Navbar toggleSidebar={toggleSidebar} /> */}
                    <Main open={isSidebarOpen}> {/* Pass open state */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Component {...pageProps} />
                      </LocalizationProvider>
                    </Main>
                  </Box>
                </Box>
              )}
            </ThemeConfig>
          </Provider>
        </CacheProvider>
      </>
    )
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
