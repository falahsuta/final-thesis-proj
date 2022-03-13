import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Switch from "@material-ui/core/Switch";

import {
  orange,
  lightBlue,
  deepPurple,
  blueGrey,
  indigo,
  deepOrange,
  red,
  blue,
} from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";

export default (props) => {
  const [darkState, setDarkState] = useState(true);
  const palletType = darkState ? "dark" : "light";
  // const mainPrimaryColor = darkState ? "#d32f2f" : lightBlue[500];
  // const mainSecondaryColor = darkState ? "#d32f2f" : deepPurple[500];
  const mainPrimaryColor = darkState ? "#648dae" : lightBlue[500];
  const mainSecondaryColor = darkState ? red[700] : "#648dae";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <Container>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {props.children}
        {/* <div style={{ marginTop: "320px" }}></div> */}
        <div style={{ marginTop: "720px" }}></div>
        <Switch checked={darkState} onChange={handleThemeChange} />
      </ThemeProvider>
    </Container>
  );
};
