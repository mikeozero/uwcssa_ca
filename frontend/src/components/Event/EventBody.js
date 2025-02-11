import {
  Alert,
  Backdrop,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import EditIcon from "@mui/icons-material/Edit";
import EventComments from "./EventDetail/Comment/EventComments";
import EventCommentsPost from "./EventDetail/Comment/EventCommentsPost";
// import EventIcon from "@mui/icons-material/Event";
import FlagIcon from "@mui/icons-material/Flag";
import ForumIcon from "@mui/icons-material/Forum";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PropTypes from "prop-types";
import SeeMore from "./SeeMore";
// import Share from "./EventDetail/Share";
import SignUpRequest from "../Auth/SignUpRequireDialog";
import TopicIcon from "@mui/icons-material/Topic";
import { makeStyles } from "@mui/styles";
// import moment from "moment";
//import EditEvent from "./EditEvent";
import { usePermit } from "../../Hooks/usePermit";
import { useSelector } from "react-redux";
import ShareIcon from "@mui/icons-material/Share";
import { ShareInfoDialog } from "../ShareInfo";

const useStyles = makeStyles((theme) => ({
  action: {
    display: "flex",
    justifyContent: "space-around",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
    },
  },
  join: {
    height: 45,
    margin: 8,
  },
  alert: {
    width: "500px",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  button: {
    [theme.breakpoints.up("sm")]: {
      width: "150px",
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    letterSpacing: "1px",
    wordWrap: "break-word",
    margin: "1rem",
  },
  codeSnippet: {
    width: "300px",
    background: "#afb3b8",
    padding: "0.1rem",
  },
  codeSection: {
    position: "relative",
    width: "100%",
  },
  share: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    // marginTop: "6rem",
  },
  aTag: {
    padding: "1rem",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#6e6e6e",
    background: "transparent",
    fontWeight: "400",
    height: 45,
    margin: 8,
  },
  hero: {
    padding: "0 4.5rem",
    [theme.breakpoints.between("sm", "lg")]: {
      padding: "0 1rem",
    },
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      {/* 为什么这里要加上typography？？？？ */}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EventBody({ event }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { userAuth } = useSelector((state) => state);
  const history = useHistory();
  const shareRef = useRef();
  const handleShareOpen = () => {
    shareRef.current.openDialog();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const userInfo = useSelector((state) => state.userAuth);

  const {
    title,
    startDate,
    endDate,
    address,
    content,
    backGroundImgURL,
    posterImgURL,
    qrCodeImgURL,
    topic,
    sponsor,
    eventParticipants,
    owner,
    id,
    online,
    eventStatus,
  } = event;

  // console.log(online);

  const isPermit = usePermit(owner, "admin");
  const handleClickOpen = () => {
    //setOpen(true);
    history.push(`/staff/event/editEvent/${id}`);
  };
  const moment = require("moment-timezone");

  const localStartDate = moment(startDate)
    .tz("America/New_York")
    .format("YYYY-MM-DD HH:mm:ss.SSS");

  const localEndDate = moment(endDate)
    .tz("America/New_York")
    .format("YYYY-MM-DD HH:mm:ss.SSS");

  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(moment(localStartDate).diff(currentTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, [moment]);

  return (
    <Box>
      {event.startDate ? (
        <div>
          <Box>
            <div>
              <Card
                variant="outlined"
                sx={{
                  margin: "auto",
                  maxWidth: "100%",
                  flexGrow: 1,
                  position: "relative",
                  backgroundImage: `url(${
                    backGroundImgURL
                      ? backGroundImgURL
                      : "https://uwcssabucket53243-master.s3.us-east-2.amazonaws.com/public/no_pic.png"
                  })`,
                  backgroundSize: "contained",

                  // objectFit: "cover",
                }}
              >
                <Grid
                  container
                  columns={12}
                  sx={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                  <Grid item xs={12} sm={6}>
                    <ButtonBase
                      sx={{
                        width: "100%",
                        height: 500,
                        justifyContent: "center",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = posterImgURL;
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          posterImgURL
                            ? posterImgURL
                            : "https://uwcssabucket53243-master.s3.us-east-2.amazonaws.com/public/no_pic.png"
                        }
                        maxHeight="100%"
                        maxWidth="100%"
                      />
                    </ButtonBase>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      minHeight={360}
                      className={classes.hero}
                      color={"common.white"}
                    >
                      <Typography component="div" variant="h4" gutterBottom>
                        <b>{title}</b>
                      </Typography>
                      {moment(localStartDate).format("YYYY") ===
                      moment(localEndDate).format("YYYY") ? (
                        <Typography variant="h6" gutterBottom>
                          时间：{localStartDate.slice(0, 4)}年
                          {localStartDate.slice(5, 7)}月
                          {localStartDate.slice(8, 10)}号{" "}
                          {localStartDate.slice(11, 16)} -{" "}
                          {localEndDate.slice(5, 7)}月
                          {localEndDate.slice(8, 10)}号{" "}
                          {localEndDate.slice(11, 16)}
                        </Typography>
                      ) : (
                        <Typography variant="h6" gutterBottom>
                          时间：{localStartDate.slice(0, 4)} 年
                          {localStartDate.slice(5, 7)}月
                          {localStartDate.slice(8, 10)}号{" "}
                          {localStartDate.slice(11, 16)} -{" "}
                          {localEndDate.slice(0, 4)}年{localEndDate.slice(5, 7)}
                          月{localEndDate.slice(8, 10)}号{" "}
                          {localEndDate.slice(11, 16)}
                        </Typography>
                      )}
                      {online === true ? (
                        <Typography variant="h6" component="div" gutterBottom>
                          地点：线上
                        </Typography>
                      ) : (
                        <div>
                          {address ? (
                            <Typography
                              variant="h6"
                              component="div"
                              gutterBottom
                            >
                              地点：{address.description}
                            </Typography>
                          ) : (
                            <Typography
                              variant="h6"
                              component="div"
                              gutterBottom
                            >
                              地点：暂无
                            </Typography>
                          )}
                        </div>
                      )}
                      {new Date(localStartDate) > new Date() ? (
                        <Typography variant="subtitle1" component="div">
                          <span>{timeBetween.days()}天 </span>
                          <span>{timeBetween.hours()}小时 </span>
                          <span>{timeBetween.minutes()}分钟 </span>
                          <span>{timeBetween.seconds()}秒 </span>
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
              {/* <CardActionArea
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = posterImgURL;
                }}
              >
                <Box
                  sx={{
                    opacity: 1, //如果背景要虚的话下面的主要图片也虚了
                    backgroundImage: `url(${
                      backGroundImgURL
                        ? backGroundImgURL
                        : "https://uwcssabucket53243-master.s3.us-east-2.amazonaws.com/public/no_pic.png"
                    })`,
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      posterImgURL
                        ? posterImgURL
                        : "https://uwcssabucket53243-master.s3.us-east-2.amazonaws.com/public/no_pic.png"
                    }
                    maxHeight="100%"
                    maxWidth="100%"
                    sx={{
                      opacity: 1,
                      position: "relative",
                      top: "50%",
                      left: "50%",
                      margin: "auto",
                      transform: `translate(-50%,-50%)`,
                      width: "auto",
                      height: "300px",
                    }}
                  />
                </Box>
              </CardActionArea> */}
            </div>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                marginBottom: "1rem",
                // bgcolor: "#FFFF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {moment(localStartDate).format("YYYY") ===
                moment(localEndDate).format("YYYY") ? (
                  <Typography variant="h6" color="primary" gutterBottom>
                    时间：{localStartDate.slice(0, 4)}年
                    {localStartDate.slice(5, 7)}月{localStartDate.slice(8, 10)}
                    号 {localStartDate.slice(11, 16)} -{" "}
                    {localEndDate.slice(5, 7)}月{localEndDate.slice(8, 10)}号{" "}
                    {localEndDate.slice(11, 16)}
                  </Typography>
                ) : (
                  <Typography variant="h6" color="primary" gutterBottom>
                    时间：{localStartDate.slice(0, 4)} 年
                    {localStartDate.slice(5, 7)}月{localStartDate.slice(8, 10)}
                    号 {localStartDate.slice(11, 16)} -{" "}
                    {localEndDate.slice(0, 4)}年{localEndDate.slice(5, 7)}月
                    {localEndDate.slice(8, 10)}号 {localEndDate.slice(11, 16)}
                  </Typography>
                )}
                <Typography component="div" variant="h5" gutterBottom>
                  <b>{title}</b>
                </Typography>

                {online === true ? (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    component="div"
                    gutterBottom
                  >
                    地点：线上
                  </Typography>
                ) : (
                  <div>
                    {address ? (
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        component="div"
                        gutterBottom
                      >
                        地点：{address.description}
                      </Typography>
                    ) : (
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        component="div"
                        gutterBottom
                      >
                        地点：暂无
                      </Typography>
                    )}
                  </div>
                )}
              </Box>
            </Box> */}
          </Box>
          <Divider sx={{ margin: "0.5rem" }} />
          <div sx={{ width: "100%" }}>
            <Container
              size="md"
              sx={{ display: "flex", flexWrap: "wrap-reverse" }}
            >
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Tabs value={value} onChange={handleChange}>
                  <Tab
                    //icon={<EventIcon />}
                    icon={<InfoIcon />}
                    arial-label="活动详情"
                    {...a11yProps(0)}
                  />
                  <Tab
                    icon={<ForumIcon />}
                    arial-label="活动讨论"
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              {/* 这里有红字，需要改一下 */}
              <Box className={classes.action}>
                <Stack direction="row" spacing={2}>
                  {/* {new Date(localEndDate) - new Date() > 0 ? (
                    <div> */}
                  {userInfo.isAuthenticated ? (
                    <div>
                      {eventStatus === "SignUpClosed" ? (
                        <Box className={classes.alert}>
                          <Alert severity="info">报名通道关闭啦~🥳</Alert>
                        </Box>
                      ) : (
                        <div>
                          {event.eventParticipants.items.some(
                            (item) => item.userID === userAuth.user.username
                          ) === false ? (
                            <Box className={classes.button}>
                              <Tooltip title="点击报名此活动" placement="top">
                                <Button
                                  size="large"
                                  // variant="outlined"
                                  fullWidth
                                  sx={{
                                    background:
                                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                    "& > *": {
                                      textTransform: "none !important",
                                    },
                                    border: 0,
                                    boxShadow:
                                      "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                    color: "white",
                                    padding: "0 30px",
                                    borderRadius: "20rem",
                                  }}
                                  className={classes.join}
                                  variant={"contained"}
                                  color={"primary"}
                                  disableRipple
                                  component={Link}
                                  to={`/event/${event.id}/eventSignUp`}
                                  startIcon={<AppRegistrationIcon />}
                                >
                                  报名
                                </Button>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box className={classes.alert}>
                              <Alert severity="success">
                                你已经报过名啦~🥳
                              </Alert>
                            </Box>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SignUpRequest />
                  )}
                  {/* </div>
                  // ) : (
                  //   <Box className={classes.alert}>
                  //     <Alert severity="info">活动结束啦~🥳</Alert>
                  //   </Box>
                  // )} */}

                  <div className={classes.share}>
                    <Tooltip title="点击分享活动链接" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleShareOpen();
                        }}
                        className={classes.aTag}
                        sx={{
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          "& > *": {
                            textTransform: "none !important",
                          },
                          border: 0,
                          boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                          color: "white",
                          padding: "0 30px",
                          borderRadius: "20rem",
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <ShareInfoDialog
                    url={`event/${id}`}
                    title={event.title}
                    ref={shareRef}
                  />
                  {isPermit ? (
                    <Tooltip title="点击编辑此活动" placement="top">
                      <IconButton variant="outlined" onClick={handleClickOpen}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              </Box>
            </Container>

            <Box sx={{ width: "100%", bgcolor: "" }}>
              <TabPanel value={value} index={0}>
                {/* 这里问题挺多的，为什么在tabpanel里面不能加box？？ */}
                <Container size="md">
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 6, sm: 8, md: 12 }}
                    >
                      <Grid item xs={6} sm={8} md={8}>
                        <Card>
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              gutterBottom
                            >
                              <b>详细信息</b>
                            </Typography>
                            {sponsor ? (
                              <Typography variant="body2" gutterBottom>
                                <FlagIcon
                                  color="action"
                                  sx={{ float: "left", marginRight: "10px" }}
                                />
                                主办方/赞助方： {sponsor}
                              </Typography>
                            ) : null}

                            {online === true ? (
                              <Typography variant="body2" gutterBottom>
                                <LocationOnIcon
                                  color="action"
                                  sx={{
                                    float: "left",
                                    marginRight: "10px",
                                  }}
                                />
                                线上
                              </Typography>
                            ) : (
                              <div>
                                {address ? (
                                  <Typography variant="body2" gutterBottom>
                                    <LocationOnIcon
                                      color="action"
                                      sx={{
                                        float: "left",
                                        marginRight: "10px",
                                      }}
                                    />
                                    {address.description}
                                  </Typography>
                                ) : null}
                              </div>
                            )}

                            {topic.name ? (
                              <Typography variant="body2" gutterBottom>
                                <TopicIcon
                                  color="action"
                                  sx={{
                                    float: "left",
                                    marginRight: "10px",
                                  }}
                                />
                                {topic.name}
                              </Typography>
                            ) : null}
                            {localStartDate > moment().format() ? (
                              <Typography variant="body2" gutterBottom>
                                <AccessTimeIcon
                                  color="action"
                                  sx={{ float: "left", marginRight: "10px" }}
                                />
                                即将来临
                              </Typography>
                            ) : (
                              <div>
                                {moment().isBetween(
                                  localStartDate,
                                  localEndDate
                                ) ? (
                                  <Typography variant="body2" gutterBottom>
                                    <AccessTimeIcon
                                      color="action"
                                      sx={{
                                        float: "left",
                                        marginRight: "10px",
                                      }}
                                    />
                                    进行中
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" gutterBottom>
                                    <AccessTimeIcon
                                      color="action"
                                      sx={{
                                        float: "left",
                                        marginRight: "10px",
                                      }}
                                    />
                                    {localEndDate < moment().format()
                                      ? "完成"
                                      : `${eventStatus}`}
                                  </Typography>
                                )}
                              </div>
                            )}
                            <Box sx={{ my: 3 }}>
                              <SeeMore content={content} />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={8}
                        md={4}
                        style={{
                          display:
                            eventParticipants.items.length === 0
                              ? "none"
                              : "block",
                        }}
                      >
                        <Card>
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              gutterBottom
                            >
                              <b>参与者</b>
                            </Typography>
                            {/* {eventParticipants.items.length === 0 ? (
                              <Typography
                                variant="h6"
                                sx={{ textAlign: "center" }}
                                gutterBottom
                              >
                                
                              </Typography>
                            ) : ( */}
                            <Typography
                              variant="h6"
                              sx={{ textAlign: "center" }}
                              gutterBottom
                            >
                              已有
                              {eventParticipants.items.reduce(function (
                                sum,
                                items
                              ) {
                                return sum + items.numberOfPeople;
                              },
                              0)}
                              人报名
                            </Typography>
                            {/* )} */}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={8} md={8}>
                        <Card>
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              gutterBottom
                            >
                              <b>联系方式</b>
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              如果你对此活动有任何疑问可以扫描以下二维码
                            </Typography>
                            {userInfo.isAuthenticated ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {qrCodeImgURL ? (
                                  <CardMedia
                                    component="img"
                                    style={{
                                      width: "auto",
                                      maxHeight: "150px",
                                    }}
                                    image={qrCodeImgURL}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Typography variant="subtitle1">
                                      暂无二维码
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{ marginBottom: "3rem" }}
                                >
                                  需要登入才能扫描哦 ~
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </TabPanel>
              <TabPanel value={value} index={1} component={"div"}>
                <Card>
                  <CardContent>
                    <EventCommentsPost event={event} />
                    <EventComments event={event} />
                  </CardContent>
                </Card>
              </TabPanel>
            </Box>
          </div>
        </div>
      ) : (
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </Box>
  );
}
