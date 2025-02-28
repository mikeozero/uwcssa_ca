import {
  // Popover,
  Typography,
  Tooltip,
  Fade,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default function ForumTimeComponent({ time }) {
  const [createDate, setCreateDate] = useState(false);

  useEffect(() => {
    const today = moment().startOf("day");
    const yesterdayStart = moment().subtract(1, "d").startOf("day");
    const yesterdayEnd = moment().subtract(1, "d").endOf("day");
    if (
      moment(time).isBetween(yesterdayStart, yesterdayEnd) ||
      moment(time).isSame(today, "d")
    ) {
      setCreateDate(true);
    }
  }, [time]);
  // const [anchorElDate, setAnchorElDate] = useState(null);
  // const handlePopoverOpenDate = (event) => {
  //   setAnchorElDate(event.currentTarget);
  // };

  // const handlePopoverCloseDate = () => {
  //   setAnchorElDate(null);
  // };
  // const openDate = Boolean(anchorElDate);
  return (
    <div>
      {createDate ? (
        <Tooltip
          title={
            <Typography color="white">
              {" "}
              {time.slice(0, 10)}
              {"-"}
              {time.slice(11, 16)}
            </Typography>
          }
          placement="top-start"
          arrow
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            //
            // aria-owns={openDate ? "mouse-over-popover-date" : undefined}
            // aria-haspopup="true"
            // onMouseEnter={handlePopoverOpenDate}
            // onMouseLeave={handlePopoverCloseDate}
            sx={{ display: "inline" }}
          >
            {moment(time).fromNow()}
          </Typography>
        </Tooltip>
      ) : (
        <Tooltip
          title={
            <Typography color="white">
              {" "}
              {time.slice(0, 10)}
              {"-"}
              {time.slice(11, 16)}
            </Typography>
          }
          placement="top-start"
          arrow
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            display="inline"
            // aria-owns={openDate ? "mouse-over-popover-date" : undefined}
            // aria-haspopup="true"
            // onMouseEnter={handlePopoverOpenDate}
            // onMouseLeave={handlePopoverCloseDate}
          >
            {/* {moment(forumPost.createdAt).format("MM月DD日")} */}
            {time.slice(5, 7)}月{time.slice(8, 10)}号
          </Typography>
        </Tooltip>
      )}
      {/* <Popover
        id="mouse-over-popover-date"
        sx={{
          pointerEvents: "none",
        }}
        open={openDate}
        anchorEl={anchorElDate}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverCloseDate}
        disableRestoreFocus
      >
        <Typography sx={{ p: 0 }}>
          {time.slice(0, 10)}
          {"-"}
          {time.slice(11, 16)}
        </Typography>
      </Popover> */}
    </div>
  );
}
