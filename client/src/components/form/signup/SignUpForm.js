import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";

import Validation from "./Validation";

const styles = (theme) => ({
  appBar: {
    position: "relative",
    paddingRight: 10,
    paddingLeft: 10,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 450,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    // marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      // marginTop: theme.spacing(8),
      // marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
    },
  },
});

const App = ({ classes, closeAll }) => {
  return (
    <div className="App">
      <CssBaseline />
      <main className={classes.layout}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Paper className={classes.paper} elevation={0}>
          <Validation closeAll={closeAll} isSignUp={true} />
        </Paper>
      </main>
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
