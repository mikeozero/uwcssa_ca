import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import GoogleMap from "../GoogleMap/GoogleMap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { marketItemOptions } from "./marketItemOptions";
import { marketRentalOptions } from "./marketRentalOptions";
import { marketVehicleOptions } from "./marketVehicleOptions";

const {
  airConditionType: ACType,
  heatingType: HType,
  catFriendly: CF,
  dogFriendly: DF,
} = marketRentalOptions;

const {
  marketItemConditionList: Conditions,
  marketItemCategoryList: Category,
} = marketItemOptions;

const { marketVehicleTypeList: VType } = marketVehicleOptions;

const DetailInfo = ({
  // general inputs
  darkTheme,
  type,
  tags,
  description,
  mode = "detail",
  // specific inputs
  // item & vehicle
  // location,
  address,
  // item
  marketItemCategory,
  marketItemCondition,
  // rental
  airConditionType,
  heatingType,
  catFriendly,
  dogFriendly,
  // vehicle
  year,
  make,
  model,
  vehicleType,
  exteriorColor,
  interiorColor,
  fuelType,
}) => {
  const [moreDescription, setMoreDescription] = React.useState(false);
  return (
    <React.Fragment>
      <Typography marginX="1rem" marginY="0.5rem" fontWeight="600">
        详情
      </Typography>
      {type === "item" ? (
        <Grid marginX="0rem" container spacing={2}>
          <Grid item xs={4}>
            类别
          </Grid>
          <Grid item xs={8}>
            {Category.map((item) => item.value).includes(marketItemCategory)
              ? Category.filter((item) => item.value === marketItemCategory)[0]
                  .label
              : ""}
          </Grid>
          <Grid item xs={4}>
            新旧程度
          </Grid>
          <Grid item xs={8}>
            {Conditions.map((item) => item.value).includes(marketItemCondition)
              ? Conditions.filter(
                  (item) => item.value === marketItemCondition
                )[0].label
              : ""}
          </Grid>
        </Grid>
      ) : null}
      {type === "rental" ? (
        <Grid marginX="0rem" container spacing={2}>
          <Grid item xs={4}>
            空调
          </Grid>
          <Grid item xs={8}>
            {ACType.map((item) => item.value).includes(airConditionType)
              ? ACType.filter((item) => item.value === airConditionType)[0]
                  .label
              : ""}
          </Grid>
          <Grid item xs={4}>
            供暖
          </Grid>
          <Grid item xs={8}>
            {HType.map((item) => item.value).includes(heatingType)
              ? HType.filter((item) => item.value === heatingType)[0].label
              : ""}
          </Grid>
          <Grid item xs={4}>
            宠物
          </Grid>
          <Grid item xs={8}>
            {CF.map((item) => item.value).includes(catFriendly) &&
            DF.map((item) => item.value).includes(dogFriendly)
              ? catFriendly && dogFriendly
                ? "可以养"
                : "不可以养"
              : ""}
          </Grid>
        </Grid>
      ) : null}
      {type === "vehicle" ? (
        <Grid marginX="0rem" container spacing={2}>
          <Grid item xs={4}>
            车型
          </Grid>
          <Grid item xs={8}>
            {VType.map((item) => item.value).includes(vehicleType)
              ? VType.filter((item) => item.value === vehicleType)[0].label
              : ""}
          </Grid>
          <Grid item xs={4}>
            品牌/型号
          </Grid>
          <Grid item xs={8}>
            {year.length === 0 && make.length === 0 && model.length === 0
              ? "Make & Model"
              : `${year} ${make} ${model}`}
          </Grid>
          <Grid item xs={4}>
            车漆颜色
          </Grid>
          <Grid item xs={8}>
            {exteriorColor.length === 0
              ? "Exterior Color Goes Here"
              : exteriorColor}
          </Grid>
          <Grid item xs={4}>
            内饰颜色
          </Grid>
          <Grid item xs={8}>
            {interiorColor.length === 0
              ? "Interior Color Goes Here"
              : interiorColor}
          </Grid>
          <Grid item xs={4}>
            汽油/柴油
          </Grid>
          <Grid item xs={8}>
            {fuelType.length === 0 ? "Fuel Type Color Goes Here" : fuelType}
          </Grid>
        </Grid>
      ) : null}
      {tags && (
        <Box>
          <Box>
            <Typography marginX="1rem" marginY="0.5rem" fontWeight="600">
              标签
            </Typography>
          </Box>
          <Stack
            direction="row"
            marginX="1rem"
            marginBottom="0.5rem"
            spacing={2}
          >
            {tags.length !== 0 ? (
              tags.map((tag, tagIdx) => {
                return <Chip key={tagIdx} label={tag} />;
              })
            ) : (
              <Chip label={"无"} />
            )}
          </Stack>
        </Box>
      )}
      <Divider variant="middle" />
      <Typography marginX="1rem" marginY="0.25rem" fontWeight="600">
        详情描述
      </Typography>
      <Box
        marginX="1rem"
        marginY="0.25rem"
        fontWeight="350"
        component="div"
        style={{ wordBreak: "break-word" }}
        sx={{
          "& .MuiButtonBase-root": {
            display: description.length < 100 ? "none" : "inline-flex",
          },
        }}
      >
        {description.length === 0
          ? "Description Goes Here"
          : moreDescription
          ? description
          : description.slice(0, 100)}
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            setMoreDescription((prev) => !prev);
          }}
        >
          {!moreDescription ? <MoreHorizIcon /> : <SearchOffIcon />}
        </IconButton>
      </Box>

      <Paper
        sx={{
          marginX: "1rem",
          marginY: "0.25rem",
          height: "250px",
          backgroundColor: darkTheme ? "black" : "rgb(243, 246, 249)",
          color: "rgb(161 161 161 / 87%)",
        }}
      >
        {mode === "detail" && address ? (
          <GoogleMap
            defaultZoom={13.5}
            address={address}
            center={[address.lat, address.lng]}
          />
        ) : (
          "Google Map Currently Unavailable (Location will be available after posted.)"
        )}
      </Paper>
      <Typography margin="1rem" marginY="0.25rem" fontWeight="250">
        {mode === "detail" && address
          ? address.terms[address.terms.length - 1]
              .split(",")[1]
              .split("=")[1]
              .split("}")[0]
          : address.description.length === 0
          ? "Location Goes Here"
          : address.description + " (exact location will not be shown)"}
      </Typography>
    </React.Fragment>
  );
};

export default DetailInfo;
