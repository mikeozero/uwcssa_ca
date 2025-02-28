import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import GoogleMapsPlace, { GetAddress } from "../GoogleMap/GoogleMapsPlace";
import React, { useEffect, useRef, useState } from "react";
import { fetchTopics, postEvent } from "../../redux/slice/eventSlice";
import { useDispatch, useSelector } from "react-redux";

import API from "@aws-amplify/api";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { GetTags } from "../../components/CustomMUI/CustomTags";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MUIRichTextEditor from "mui-rte";
import PublishIcon from "@mui/icons-material/Publish";
import QrCodeIcon from "@mui/icons-material/QrCode";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import { convertToRaw } from "draft-js";
import { createTopic } from "../../graphql/mutations";
import { graphqlOperation } from "@aws-amplify/api-graphql";
import { green } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import { postAddress } from "../../redux/slice/addressSlice";
import { postSingleImage } from "../../redux/slice/generalSlice";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router";
import { useTitle } from "../../Hooks/useTitle";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "3rem",
    maxWidth: "960px",
  },

  form: {
    margin: "auto 1rem",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginBlock: "2rem",
    minHeight: "300px",
    paddingInline: "1rem",
    overflow: "auto",
    border: "1px solid",
    borderColor: "#cfd8dc",
    borderRadius: 5,
  },
  picture: {
    marginBlock: "2rem",
    Height: "300px",
    minHeight: "300px",
    paddingInline: "1rem",
    overflow: "auto",
    border: "1px dashed",
    borderColor: "#cfd8dc",
    borderRadius: 5,
  },
  container: {
    marginBlock: "2rem",
    Height: "300px",
    minHeight: "300px",
    paddingInline: "1rem",
    overflow: "auto",
    border: "1px dashed",
    borderColor: "#cfd8dc",
    borderRadius: 5,
    position: "relative",
  },
  child: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const eventStatusList = [
  { value: "ComingSoon", label: "即将来临" },
  { value: "SignUpClosed", label: "报名关闭" },
  { value: "InProgress", label: "进行中" },
  { value: "Finished", label: "完成" },
  { value: "Canceled", label: "取消" },
];

const Input = styled("input")({
  display: "none",
});
export default function PostEvent() {
  const classes = useStyles();
  useTitle("活动创建");
  const dispatch = useDispatch();

  const [backGroundImgURL, setBackGroundImgURL] = useState(undefined);
  const [qrCodeImgURL, setQrCodeImgURL] = useState(undefined);
  const [posterImgURL, setPosterImgURL] = useState(undefined);
  const [isTitleAsURL, setIsTitleAsURL] = useState(false);
  const { username } = useSelector((state) => state.userAuth.user);
  const history = useHistory();
  const timer = useRef();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [state, setState] = useState({
    online: false,
    group: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      summary: "",
      startDate: null,
      endDate: null,
      content: "",
      topicID: "",
      sponsor: "",
      eventStatus: "",
    },
  });

  const { topics, fetchTopicsStatus } = useSelector((state) => state.event);

  useEffect(() => {
    if (fetchTopicsStatus === "idle" || undefined) {
      dispatch(fetchTopics());
    }
  }, [dispatch, fetchTopicsStatus]);

  const uploadEventImg = async (e) => {
    const imageData = e.target.files;
    const imageLocation = "event";
    const response = await dispatch(
      postSingleImage({ imageData, imageLocation })
    );
    if (response.meta.requestStatus === "fulfilled") {
      setBackGroundImgURL(response.payload);
    }
  };

  const uploadEventPoster = async (e) => {
    const imageData = e.target.files;
    const imageLocation = "event";
    const response = await dispatch(
      postSingleImage({ imageData, imageLocation })
    );
    if (response.meta.requestStatus === "fulfilled") {
      setPosterImgURL(response.payload);
    }
  };

  const uploadEventQrCode = async (e) => {
    const imageData = e.target.files;
    const imageLocation = "event";
    const response = await dispatch(
      postSingleImage({ imageData, imageLocation })
    );
    if (response) {
      setQrCodeImgURL(response.payload);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const address = await GetAddress();
    const addressID = uuid();
    const itemID = uuid();
    if (address) {
      const {
        description,
        place_id,
        reference,
        terms,
        types,
        apartmentNumber,
        geocodingResult,
        lat,
        lng,
      } = address;
      const createAddressInput = {
        description,
        place_id,
        reference,
        terms,
        types,
        apartmentNumber,
        geocodingResult,
        lat,
        lng,
        itemID: itemID,
        userID: username,
        id: addressID,
      };
      console.log(createAddressInput);
      const addressResponse = await dispatch(
        postAddress({ createAddressInput })
      );
      console.log(addressResponse);
    }
    const createEventInput = {
      ...data,
      id: itemID,
      addressID: state.online ? "" : address && addressID,
      backGroundImgURL: backGroundImgURL,
      posterImgURL: posterImgURL,
      qrCodeImgURL: qrCodeImgURL,
      content: content,
      online: state.online,
      group: state.group,
      active: true,
      sortKey: "SortKey",
      userID: username,
      tags: GetTags(),
    };
    console.log(createEventInput);

    const response = await dispatch(postEvent({ createEventInput }));

    if (response.meta.requestStatus === "fulfilled") {
      setLoading(false);
      history.replace(`/event/${response.payload.data.createEvent.id}`);
    } else {
      timer.current = window.setTimeout(() => {
        console.log(response.error.message);
        setLoading(false);
      }, 1000);

      alert(response.error.message);
    }
  };
  const [topicData, setTopicData] = useState({ name: "" });

  const uploadTopic = async () => {
    //Upload the topic
    const createTopicInput = {
      id: topicData.name, //为了不让数据重复，直接定义ID
      name: topicData.name,
      userID: username,
    };
    await API.graphql(
      graphqlOperation(createTopic, { input: createTopicInput })
    );
    dispatch(fetchTopics());
    setTopicData({ name: "" });
  };
  const handleOnChange = (prop) => (event) => {
    const tempContent = JSON.stringify(convertToRaw(event.getCurrentContent()));
    setContent(tempContent);
  };

  const onPosterClear = () => {
    setPosterImgURL(null);
  };
  const onBackgroundImgClear = () => {
    setBackGroundImgURL(null);
  };
  const onQrCodeClear = () => {
    setQrCodeImgURL(null);
  };

  return (
    <div>
      <Box
        className={classes.root}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography variant="h4" sx={{ textAlign: "center" }} gutterBottom>
          活动策划
        </Typography>
        <Box>
          <Box className={classes.form}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  required
                  id="title"
                  label="标题"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                  error={!!errors.title}
                  helperText={errors.title ? "不能为空" : null}
                />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTitleAsURL}
                  onChange={(event) => setIsTitleAsURL(event.target.checked)}
                />
              }
              label="用标题作为URL，一旦发出不能更改，除非删掉，并且有唯一性"
            />
            {/* <Box sx={{ my: "1rem" }}>
              <Controller
                name="summary"
                control={control}
                rules={{
                  required: false,
                  minLength: 3,
                  maxLength: 300,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    label="简要概述"
                    variant="outlined"
                    fullWidth
                    multiline={true}
                    rows={4}
                    onChange={onChange}
                    value={value}
                    error={!!errors.summary}
                    helperText={errors.summary ? "不符合标准，3~300字" : null}
                  />
                )}
              />
            </Box> */}
            <Controller
              name="topicID"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="topicID">主题</InputLabel>
                  <Select
                    labelId="topicID"
                    value={value}
                    onChange={onChange}
                    label="主题"
                    error={!!errors.topicID}
                    // FormHelperHelperText={
                    //   errors.topicID
                    //     ? "选择一个主题，没有的话请上传新的类别"
                    //     : null
                    // }
                  >
                    {topics.map((topic) => {
                      return (
                        <MenuItem value={topic.id} key={topic.id}>
                          {topic.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.topicID && (
                    <FormHelperText sx={{ color: "#d32f2f" }}>
                      请选择一个主题，没有的话请上传新的主题
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <TextField
              margin="normal"
              fullWidth
              label="新的主题"
              value={topicData.name}
              onChange={(e) =>
                setTopicData({ ...topicData, name: e.target.value })
              }
            />
            <Button
              variant="contained"
              endIcon={<PublishIcon />}
              onClick={uploadTopic}
              color="primary"
            >
              上传新的主题
            </Button>

            <Controller
              name="sponsor"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="主办方/赞助商"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Box sx={{ margin: "1rem 0" }}>
                      <DateTimePicker
                        label="开始时间"
                        value={value}
                        id="startDate"
                        error={!!errors.startDate}
                        onChange={onChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      {errors.startDate && (
                        <FormHelperText sx={{ color: "#d32f2f" }}>
                          不能为空
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <DateTimePicker
                        label="结束时间"
                        value={value}
                        id="endDate"
                        onChange={onChange}
                        renderInput={(params) => <TextField {...params} />}
                        error={!!errors.endDate}
                      />
                      {errors.endDate && (
                        <FormHelperText sx={{ color: "#d32f2f" }}>
                          不能为空
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Stack>
            </LocalizationProvider>

            {/* <Controller
              name="online"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, checked } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={checked}
                      onChange={onChange}
                      name="online"
                    />
                  }
                  label="online"
                />
              )}
            /> */}
            <div style={{ margin: "1rem  0.5rem" }}>
              <FormLabel component="legend">Online Event?</FormLabel>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>No</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.online}
                      onChange={handleChange}
                      name="online"
                    />
                  }
                  label=""
                />
                <Typography>Yes</Typography>
              </Stack>
            </div>

            {state.online ? null : <GoogleMapsPlace />}

            <div style={{ margin: "0 0.5rem 1rem 0.5rem" }}>
              <FormLabel component="legend">Group?</FormLabel>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>No</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.group}
                      onChange={handleChange}
                      name="group"
                    />
                  }
                  label=""
                />
                <Typography>Yes</Typography>
              </Stack>
            </div>

            {/* <Typography variant="h3">
              {GetAddress().googleMapPlace}45646
            </Typography> */}
            <Box className={classes.type}>
              <div className="newType">
                <Controller
                  name="eventStatus"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="eventStatus">活动状态</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="eventStatus"
                        defaultValue=""
                        value={value}
                        onChange={onChange}
                        label="Event Status"
                        error={!!errors.eventStatus}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {eventStatusList.map((eventStatus) => {
                          return (
                            <MenuItem
                              value={eventStatus.value}
                              key={eventStatus.value}
                            >
                              {eventStatus.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.eventStatus && (
                        <FormHelperText sx={{ color: "#d32f2f" }}>
                          请选择一个活动状态
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </Box>
            {/* <Controller
              name="content"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                
                // <TextField
                //   margin="normal"
                //   fullWidth
                //   label="Content"
                //   minRows={20}
                //   variant="outlined"
                //   multiline
                //   onChange={onChange}
                //   value={value}
                //   error={!!errors.content}
                //   helperText={errors.content ? "不能为空" : null}
                // />
              )}
            /> */}
            <Box className={classes.content}>
              <MUIRichTextEditor
                label="活动详情"
                onChange={handleOnChange()}
                inlineToolbar={true}
                controls={[
                  "title",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "highlight",
                  "undo",
                  "redo",
                  "link",
                  "media",
                  "numberList",
                  "bulletList",
                  "quote",
                  "code",
                  "clear",
                ]}
              />
            </Box>
            <Box>
              <div style={{ marginBottom: "1rem" }}>
                {posterImgURL ? (
                  <Box className={classes.picture}>
                    <img
                      src={posterImgURL}
                      alt="posterImgURL"
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box className={classes.container}>
                    <Box className={classes.child} color={"grey.700"}>
                      <InsertPhotoIcon
                        style={{
                          display: "block",
                          margin: "auto",
                          width: "100%",
                          height: "100px",
                          verticalAlign: "middle",
                          lineHeight: "300px",
                        }}
                      />
                      <Typography gutterBottom variant="h5">
                        上传活动海报预览
                      </Typography>
                    </Box>
                  </Box>
                )}
                <label htmlFor="poster">
                  <Input
                    accept="poster/*"
                    id="poster"
                    type="file"
                    onChange={(e) => {
                      uploadEventPoster(e);
                    }}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                  >
                    上传活动海报
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </label>
                <Button
                  onClick={onPosterClear}
                  variant="outlined"
                  color="error"
                  sx={{ margin: " 0 1rem" }}
                >
                  清除活动海报
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </Button>
              </div>
              <Divider />
              <div style={{ marginBottom: "1rem" }}>
                {backGroundImgURL ? (
                  <Box className={classes.picture}>
                    <img
                      src={backGroundImgURL}
                      alt="backGroundImgURL"
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box className={classes.container}>
                    <Box className={classes.child} color={"grey.700"}>
                      <WallpaperIcon
                        style={{
                          display: "block",
                          margin: "auto",
                          width: "100%",
                          height: "100px",
                          verticalAlign: "middle",
                          lineHeight: "300px",
                        }}
                      />
                      <Typography gutterBottom variant="h5">
                        上传背景图片预览
                      </Typography>
                    </Box>
                  </Box>
                )}
                <label htmlFor="uploadEventImg" sx={{ margin: "normal" }}>
                  <Input
                    accept="eventImg/*"
                    id="uploadEventImg"
                    type="file"
                    onChange={(e) => {
                      // setImgData();
                      uploadEventImg(e);
                    }}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                  >
                    上传背景图片
                  </Button>

                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </label>
                <Button
                  onClick={onBackgroundImgClear}
                  variant="outlined"
                  color="error"
                  sx={{ margin: "0 1rem" }}
                >
                  清除背景图片
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </Button>
              </div>
              <Divider />
              <div style={{ marginBottom: "1rem" }}>
                {qrCodeImgURL ? (
                  <Box className={classes.picture}>
                    <img
                      src={qrCodeImgURL}
                      alt="qrCodeImgURL"
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box className={classes.container}>
                    <Box className={classes.child} color={"grey.700"}>
                      <QrCodeIcon
                        style={{
                          display: "block",
                          margin: "auto",
                          width: "100%",
                          height: "100px",
                          verticalAlign: "middle",
                          lineHeight: "300px",
                        }}
                      />
                      <Typography gutterBottom variant="h5">
                        上传QrCode预览
                      </Typography>
                    </Box>
                  </Box>
                )}
                <label htmlFor="uploadEventQrCode">
                  <Input
                    accept="eventQrCode/*"
                    id="uploadEventQrCode"
                    type="file"
                    onChange={(e) => {
                      uploadEventQrCode(e);
                    }}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                  >
                    上传活动QR
                  </Button>

                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </label>
                <Button
                  onClick={onQrCodeClear}
                  variant="outlined"
                  color="error"
                  sx={{ margin: "0 1rem" }}
                >
                  清除活动QR
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-0.75rem",
                        marginLeft: "-0.75rem",
                      }}
                    />
                  )}
                </Button>
              </div>
            </Box>
            <Divider />
            <Button
              variant="contained"
              type="submit"
              endIcon={<PublishIcon />}
              color="primary"
              disabled={loading}
              sx={{ marginBlock: "2rem" }}
            >
              上传活动
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-0.75rem",
                    marginLeft: "-0.75rem",
                  }}
                />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
