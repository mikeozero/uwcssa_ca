import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { CategoryIcons, SearchArea } from "./marketItemSearch";

import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import MarketFIlterLocation from "./marketFilterLocation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";
import WorkIcon from "@mui/icons-material/Work";
import { makeStyles } from "@mui/styles";

const MarketSideBar = ({ clickHandler, darkTheme }) => {
  const useStyles = makeStyles((theme) => ({
    info: {
      width: "360px",
      height: "100%",
      float: "left",
      overflow: "hidden",
      position: "relative",

      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "100%",
      },
    },
    paper: {
      padding: "1rem",
      height: "100%",
      marginRight: "5px",
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      overflow: "hidden",
    },
  }));
  const classes = useStyles();

  const UtilityIcons = () => {
    return (
      <Box color={`${darkTheme ? "#787878" : "#fffff"}`}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Button} onClick={clickHandler}>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="查看全部" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/market/notifications">
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="消息" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  };

  return (
    <Box className={classes.info}>
      <Paper className={classes.paper} elevation={3}>
        <Typography
          variant="h5"
          marginBottom="1rem"
          fontWeight="bold"
          color={`${darkTheme ? "#787878" : "#fffff"}`}
        >
          商城
        </Typography>
        <Box width="100%" marginBottom="1rem" overflow="hidden">
          <SearchArea darkTheme={darkTheme} />
          <UtilityIcons />
          <Button
            variant="outlined"
            sx={{ marginX: "1rem", marginBottom: "1rem" }}
            startIcon={<AddIcon />}
            component={Link}
            to="/market/create"
          >
            新增商品
          </Button>
          <Divider />
        </Box>

        <Box
          width="100%"
          overflow="hidden"
          color={`${darkTheme ? "#787878" : "#fffff"}`}
        >
          <Typography variant="h6" fontWeight="bold">
            位置
          </Typography>
          <MarketFIlterLocation marketType={"all"} />
        </Box>
        <Typography
          variant="h6"
          marginBottom="1rem"
          fontWeight="bold"
          color={`${darkTheme ? "#787878" : "#fffff"}`}
        >
          类别
        </Typography>
        <Box
          width="100%"
          sx={{
            overflowY: "auto",
            color: "#c1c1c1",

            transition: "color 0.3s",
            "&:hover": {
              color: "#a9a9a9",
            },
            "&::-webkit-scrollbar": {
              width: "14px",
            },

            "&::-webkit-scrollbar-button": {
              width: 0,
              height: 0,
              display: "none",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundClip: "content-box",
              border: "4px solid transparent",
              borderRadius: "7px",
              boxShadow: "inset 0 0 0 10px",
            },
            "&::-webkit-scrollbar-corner": {
              backgroundColor: "transparent",
            },
          }}
        >
          <CategoryIcons darkTheme={darkTheme} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MarketSideBar;
