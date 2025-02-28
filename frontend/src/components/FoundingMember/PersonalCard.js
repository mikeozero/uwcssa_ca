import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { forwardRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
// import ShareIcon from "@mui/icons-material/Share";
import Edit from "./Edit";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MUIRichTextEditor from "mui-rte";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { grey } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import { usePermit } from "../../Hooks/usePermit";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import EditAvatar from "../cropper/EditAvatar";

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  box: {
    boxShadow: "0 3px 12px 0 #8888",
    "&:hover": {
      transform: "scale(0.98)",
      boxShadow: "none",
    },
  },
  root: {
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    position: "absolute",
    height: 335,
    width: 300,
    marginLeft: "auto",
    overflow: "initial",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    paddingBottom: spacing(2),
    bottom: 0,
    zIndex: 1,
  },
  media: {
    // width: "88%",
    height: 170,
    width: 264,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: spacing(-3),
    // height: 0,
    paddingBottom: "48%",
    borderRadius: spacing(2),
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    right: 16,
    zIndex: 2,
  },

  cta: {
    marginTop: 24,
    textTransform: "initial",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 14,
    color: grey[500],
    marginBottom: "2rem",
  },
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    [breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  image: {
    marginLeft: "2rem",
    marginTop: "-8rem",
    [breakpoints.down("lg")]: {
      // marginLeft: "2rem",
      marginTop: "-8rem",
    },
    [breakpoints.down("sm")]: {
      // margin: "0 1.45rem",
      margin: "0 auto",
    },
  },

  pad: {
    [breakpoints.up("sm")]: {
      padding: "0 2rem",
    },
  },
  appBar: {
    backgroundColor: palette.mode === "dark" ? "#616161" : "#ffff",
  },
  information: {
    minWidth: 500,
    maxWidth: 800,
    [breakpoints.down("md")]: {
      minWidth: 200,
      maxWidth: 340,
    },
    [breakpoints.down("sm")]: {
      minWidth: 200,
      maxWidth: 300,
    },
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PersonalCard({
  lastName,
  firstName,
  username,
  id,
  title,
  summary,
  imgURL,
  content,
  owner,
  item,
  linkedIn,
  github,
  startDate,
  endDate,
  email,
}) {
  const classes = useStyles();

  const isPermit = usePermit(owner, "admin");
  //   const [expanded, setExpanded] = useState(true);
  const [settingMoreAnchorEl, setSettingMoreAnchorEl] = useState(null);
  const isSettingMenuOpen = Boolean(settingMoreAnchorEl);
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);

  const handleEditClickOpen = () => {
    setSettingMoreAnchorEl(null);
    setEditOpen(true);
  };

  const handleEditAvatarClickOpen = () => {
    setSettingMoreAnchorEl(null);
    setEditAvatarOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleEditAvatarClose = () => {
    setEditAvatarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSettingMenuClose = () => {
    setSettingMoreAnchorEl(null);
  };
  const handleSettingMenuOpen = (event) => {
    setSettingMoreAnchorEl(event.currentTarget);
  };
  const renderSettingMenu = (
    <Menu
      anchorEl={settingMoreAnchorEl}
      disableScrollLock={true}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isSettingMenuOpen}
      onClose={handleSettingMenuClose}
    >
      <MenuItem onClick={handleEditAvatarClickOpen}>
        <PhotoCameraRoundedIcon />
        编辑 头像
      </MenuItem>
      <MenuItem onClick={handleEditClickOpen}>
        <EditIcon />
        编辑 信息
      </MenuItem>
    </Menu>
  );

  return (
    <Grid item xs={2} sm={4} md={4} sx={{ margin: " 2rem 0" }}>
      <Box
        sx={{
          position: "relative",
          height: 340,
          width: 300,
          borderRadius: "16px",
        }}
        className={classes.box}
      >
        <CardMedia
          className={classes.media}
          image={
            imgURL
              ? imgURL
              : "https://uwcssabucket53243-master.s3.us-east-2.amazonaws.com/public/no_pic.png"
          }
        />
        <Card
          className={classes.root}
          sx={{
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ textAlign: "center", marginTop: "8rem" }}>
            {lastName && firstName ? (
              <Typography variant="subtitle1" className={classes.heading}>
                {!/[^a-zA-Z,(,)]+$/.test(lastName) &&
                !/[^a-zA-Z,(,)]+$/.test(firstName)
                  ? `${firstName} ${lastName}`
                  : `${lastName}${firstName}`}
              </Typography>
            ) : (
              <Typography variant="subtitle1" className={classes.heading}>
                Full Name
              </Typography>
            )}
            <Typography
              variant="body2"
              color="primary"
              gutterBottom
              component={Link}
              to={`/account/profile/${username}`}
              sx={{ textDecoration: "none" }}
            >
              <b>@{id}</b>
            </Typography>
            <Typography variant="subtitle2" className={classes.subheader}>
              {title ? title : "暂无，请编辑..."}
            </Typography>
            {startDate && endDate ? (
              <Typography variant="caption">
                在职时间: {startDate ? startDate.slice(0, 10) : "yyyy-mm-dd"} -{" "}
                {endDate ? endDate.slice(0, 10) : "yyyy-mm-dd"}
              </Typography>
            ) : null}
            <Divider light sx={{ margin: "1rem 0" }} />
            <Typography variant="body2" color="text.secondary">
              {summary ? summary : "请编辑..."}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => window.open(`mailto:${email}`)}>
              <EmailIcon />
            </IconButton>
            {linkedIn ? (
              <IconButton
                onClick={() => {
                  window.location.href = `${linkedIn}`;
                }}
              >
                <LinkedInIcon />
              </IconButton>
            ) : null}
            {github ? (
              <IconButton
                onClick={() => {
                  window.location.href = `${github}`;
                }}
              >
                <GitHubIcon />
              </IconButton>
            ) : null}
            {isPermit ? (
              <IconButton
                aria-label="settings"
                aria-haspopup="true"
                onClick={handleSettingMenuOpen}
                color="inherit"
                className={classes.edit}
              >
                <MoreVertIcon />
              </IconButton>
            ) : null}
            <Button
              variant="text"
              onClick={handleClickOpen}
              sx={{
                marginLeft: "auto",
                // "&.MuiButton-text": { color: "#616161" },
              }}
            >
              查看简介
            </Button>
          </CardActions>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar
              sx={{
                position: "relative",
              }}
            >
              <Toolbar>
                <IconButton
                  edge="start"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Container maxWidth="md">
              <Box className={classes.pad}>
                <Grid container columns={12}>
                  <Grid item xs={12} sm={8}>
                    {lastName && firstName ? (
                      <Typography
                        variant="h4"
                        className={classes.heading}
                        sx={{ margin: "3rem auto 1rem auto" }}
                      >
                        {!/[^a-zA-Z,(,)]+$/.test(lastName) &&
                        !/[^a-zA-Z,(,)]+$/.test(firstName)
                          ? `${firstName} ${lastName}`
                          : `${lastName}${firstName}`}
                      </Typography>
                    ) : (
                      <Typography
                        variant="h4"
                        className={classes.heading}
                        sx={{ margin: "3rem auto 1rem auto" }}
                      >
                        Full Name
                      </Typography>
                    )}

                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ margin: "auto auto 2rem auto" }}
                    >
                      <b>{title ? title : "暂无，请编辑..."}</b>
                    </Typography>
                  </Grid>
                  <Box className={classes.container}>
                    <Grid item xs={12} sm={4} p={"0 1rem"}>
                      <img
                        src={imgURL}
                        alt="Avatar"
                        style={{
                          borderRadius: "50%",
                          width: "300px",
                          height: "300px",
                          objectFit: "cover",
                        }}
                        className={classes.image}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <MUIRichTextEditor
                        defaultValue={content}
                        readOnly={true}
                        toolbar={false}
                      />
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Container>
          </Dialog>
        </Card>
        {renderSettingMenu}
        <Edit
          editOpen={editOpen}
          handleEditClose={handleEditClose}
          item={item}
        />
        <EditAvatar
          editAvatarOpen={editAvatarOpen}
          handleEditAvatarClose={handleEditAvatarClose}
          item={item}
          type="foundingMember"
        />
      </Box>
    </Grid>
  );
}
