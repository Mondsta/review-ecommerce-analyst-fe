import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useRouter } from "next/router";
import Image from "next/image";

import api from "../services/api";
import { setToken, getToken } from "../utils/token";
import useToast from "../utils/toast";
import FaviconLogo from "../public/static/logo/favicon.ico";

// Styled Button for modern look
const CustomButton = styled(Button)({
  background: "#000000",
  borderRadius: "8px",
  color: "white",
  height: 48,
  padding: "0 30px",
  boxShadow: "0px 3px 5px 2px rgba(0, 105, 255, .3)",
  transition: "transform 0.3s ease",
  "&:hover": {
    backgroundColor: "#000000 ",
    transform: "scale(1.05)", // Slight zoom on hover
  },
});

const Login = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const [loginValue, setLoginValue] = useState({
    email: "admin@gmail.com",
    password: "admin1234",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setLoginValue({ ...loginValue, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (getToken("token")) {
      router.push("/");
    }
  }, []);

  async function onFinish() {
    try {
      setToken("token", "jwtToken");
      // const postLoginData = await api.loginApi(loginValue);
      // setToken("token", postLoginData.data.data.token);
      router.replace("/try");
    } catch (error) {
      displayToast("error", "Failed to login");
    }
  }

  if (typeof window !== "undefined" && getToken("token")) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid
          item
          xs={3}
          sx={{
            zIndex: "5",
          }}
        >
          <Card
            sx={{
              width: "400px",
              background: "#FFFFFF",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)", // Deeper shadow for modern look
              borderRadius: "16px", // Rounded corners
            }}
          >
            <CardContent>
              <Stack component="form" spacing={3} noValidate>
                <Box display={"flex"} justifyContent={"center"}>
                  <Image
                    src={FaviconLogo}
                    width={100}
                    height={100}
                    alt="login logo"
                  />
                </Box>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ fontWeight: "bold", color: "#000000" }}
                >
                  Welcome Back
                </Typography>
                <Divider sx={{ marginY: "16px" }} />
                <TextField
                  label="Email"
                  name="email"
                  value={loginValue.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-input": { color: "#000000" },
                    "& label.Mui-focused": { color: "#000000" },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginValue.password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-input": { color: "#000000" },
                    "& label.Mui-focused": { color: "#000000" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Divider sx={{ mt: 2 }} />
                <CustomButton
                  disabled={!loginValue.email || !loginValue.password}
                  onClick={onFinish}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Log In
                </CustomButton>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;