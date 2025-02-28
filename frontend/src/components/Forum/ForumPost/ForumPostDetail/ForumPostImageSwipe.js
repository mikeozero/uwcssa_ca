import { Box, Stack } from "@mui/material";
import React, { useState } from "react";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";

export default function ForumPostImageSwipe({ images }) {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;
  console.log("maxSteps", maxSteps);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box width="100%" height="100%" position="relative" overflow="hidden">
      {maxSteps <= 1 ? null : (
        <Box
          sx={{
            bgcolor: "white",
            left: {xs:"30px",md:"60px"},
            zIndex: "2",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "25px",
            opacity:0.6
          }}
        >
          <IconButton
            color="info"
            aria-label="leftMove"
            component="span"
            disabled={activeStep === 0 ? true : false}
            onClick={() => handleBack()}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
      )}
      {maxSteps <= 1 ? null : (
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "25px",
            right: {xs:"0px",md:"20px"},
            zIndex: "2",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity:0.6
          }}
        >
          <IconButton
            color="info"
            aria-label="rightMove"
            component="span"
            disabled={activeStep === maxSteps - 1 ? true : false}
            onClick={() => handleNext()}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          // bgcolor: "blue",
          top: "0",
          left: "0",
          right: "0",
          bottom: "60px",
          zIndex: "1",
          position: "absolute",
          margin: "auto",
        }}
      >
        <Box
          component="img"
          src={images[activeStep]}
          maxHeight="100%"
          maxWidth="120%"
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            right: "0",
            margin: "auto",
            transform: `translate(-50%,-50%)`,
            width: "auto",
            height: "auto",
          }}
        />
      </Box>
      <Box
        sx={{
          maxWidth: "100%",
          height: "40px",
          // bgcolor: "red",
          bottom: 30,
          left: 0,
          right: 10,
          zIndex: "1",
          position: "absolute",
          margin: "auto",
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          // margin="10px"
          zIndex="5"
          justifyContent="center"
        >
          {images.map((img, imgKey) => {
            return (
              <Box
                key={imgKey}
                component="img"
                src={img}
                height="40px"
                width="40px"
                borderRadius="5px"
                sx={imgKey === activeStep ? null : { filter: "blur(1px)" }}
                onClick={() => setActiveStep(imgKey)}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
