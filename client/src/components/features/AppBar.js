import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../../actions";
import Navbar from "../navbar/Navbar";

const useStyles = makeStyles((props) => ({
  root: {
    minHeight: 59,
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  dispatch(getCurrentUser());

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar color="transparent" elevation={0}>
          <Toolbar className={classes.root}>
            <Container>
              <Navbar />
              <Divider
                style={{ marginTop: "3px" }}
                variant="middle"
                light
                variant="fullWidth"
              />
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>
  );
};
