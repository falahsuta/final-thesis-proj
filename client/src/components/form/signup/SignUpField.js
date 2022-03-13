import React, { Fragment, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch } from "react-redux";
import { signIn, getCurrentUser, setCredentials } from "../../../actions";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    // margin: theme.spacing(1),
    marginTop: "20px",
    margin: "0 auto",
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  typography: {
    // margin: "0 auto",
    // marginTop: "10px",
  },
  messageError: {
    color: "red",
  },
}));

// Destructure props
const FirstStep = ({
  handleNext,
  handleChange,
  values: { email, password },
  filedError,
  isError,
  closeAll,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const [error, setError] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [success, setSuccess] = useState("SIGN IN");

  const classes = useStyles();
  const emailRegex = RegExp(/^[^@]+@[^@]+\.[^@]+$/);
  const isEmpty =
    email.length > 0 && password.length > 0 && emailRegex.test(email);

  // const [err, setErr] =

  const sendToServer = async () => {
    const value = {
      username: email,
      password,
    };

    dispatch(signIn(value))
      .then((action) => {
        setSuccess("Success Authenticated");
        dispatch(action);
        closeAll();
      })
      .catch((err) => {
        setError(err.response.data.errors);
      });
    // const response = await axios.get(
    //   "http://localhost:4001/api/users/currentUser",
    //   { withCredentials: true }
    // );
    // console.log(response.data);
  };

  const showLoadingButton = () => {
    setError([]);
    setShowButton(true);
    setTimeout(() => {
      setShowButton(false);
      sendToServer();
    }, 600);
  };

  return (
    <Fragment>
      <Grid
        container
        spacing={2}
        noValidate
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} alignItems="center">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>

        {/* <Grid item xs={12} sm={12} alignItems="center"> */}
        <div className={classes.typography}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </div>
        {/* </Grid> */}

        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            // autoComplete="off"
            label="Email"
            name="email"
            placeholder="Your email address"
            type="email"
            defaultValue={email}
            onChange={handleChange("email")}
            margin="normal"
            error={filedError.email !== ""}
            helperText={filedError.email !== "" ? `${filedError.email}` : ""}
            required
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            defaultValue={password}
            onChange={handleChange("password")}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={filedError.password !== ""}
            helperText={
              filedError.password !== "" ? `${filedError.password}` : ""
            }
          />
        </Grid>
        <div
          style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
        >
          {error.map((error) => {
            return (
              <Typography
                // className={classes.messageError}
                component="h3"
                variant="body1"
              >
                {error.message}
              </Typography>
            );
          })}
        </div>
      </Grid>
      <br />
      <br />
      <br />
      <br />

      <div
        style={{ display: "flex", marginTop: 10, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          disabled={!isEmpty || isError}
          color={`${showButton ? undefined : "primary"}`}
          fullWidth
          onClick={showLoadingButton}
        >
          {showButton ? (
            <CircularProgress thickness={4} size={30} color="primary" />
          ) : (
            success
          )}
        </Button>
      </div>
    </Fragment>
  );
};

export default FirstStep;
