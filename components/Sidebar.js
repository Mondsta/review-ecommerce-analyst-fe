import React from "react";
import Image from "next/image";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import FaviconLogo from "../public/static/logo/favicon.ico";
import { useRouter } from "next/router";
import { getToken, deleteToken } from "../utils/token";
import { Routes } from "./Routes";
import { BottomRoutes } from "./BottomRoutes";
import { Logout } from "@mui/icons-material";

const drawerWidth = 280;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#202123",
    color: "#fff",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: "#343541",
}));

const ListFooter = styled(List)(() => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
}));

const Sidebar = () => {
  const router = useRouter();

  function changeRoute(route) {
    router.push(route);
  }

  function logout() {
    deleteToken("token");
    changeRoute("/login");
  }

  const MenuItem = ({ item }) => {
    return (
      <ListItem
        key={item.menu}
        onClick={item.path === "/logout" ? logout : () => changeRoute(item.path)}
        disablePadding
        sx={{ display: "block" }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: "initial",
            px: 2.5,
          }}
        >
          <Tooltip title={item.menu} arrow placement="right-start">
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: "center",
                color: "#ffffff",
                opacity: 0.8,
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
          <ListItemText primary={item.menu} sx={{ color: "#ffffff" }} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer variant="permanent">
      <div>
        {Routes.map((item, key) => (
          <MenuItem key={key} item={item} />
        ))}
        <ListFooter>
          {BottomRoutes.map((item, key) => (
            <MenuItem key={key} item={item} />
          ))}
          <MenuItem
            item={{ menu: "Logout", path: "/logout", icon: <Logout /> }}
          />
        </ListFooter>
      </div>
    </Drawer>
  );
};

export default Sidebar;
