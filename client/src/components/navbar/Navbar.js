import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import Fade from "@material-ui/core/Fade";
import { useHistory } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import { useLocation } from "react-router-dom";

import SignInForm from "../form/signin/SignInForm";
import SignUpForm from "../form/signup/SignUpForm";
import Contribute from "../dialog/Contribute";
import Transact from "../dialog/Transact";
import Balance from "../dialog/Balance";

import { signOut, closeContribe } from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      maxWidth: "100%",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default () => {
  const location = useLocation();

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [openClick, setOpenClick] = useState(false);

  const [openTransact, setOpenTransact] = useState(false);
  const [openBalance, setOpenBalance] = useState(false);

  const handleOpen = (label) => {
    label === "SignUp" ? setShowRegister(true) : setShowLogin(true);
  };

  const handleClose = (label) => {
    label === "SignUp" ? setShowRegister(false) : setShowLogin(false);
  };

  const handleClickOpen = () => {
    setOpenClick(true);
  };

  const handleClickClose = () => {
    setOpenClick(false);
    setOpenBalance(false);
    setOpenTransact(false);
    // transition paused close for better unmounting contribes component
    setTimeout(() => {
      dispatch(closeContribe());
    }, 300);
  };

  const handleActionLog = (label) => {
    if (label === "Logout") {
      dispatch(signOut());
    }

    if (label === "Contribution") {
      setOpenClick(true);
    }

    if (label === "History") {
      setOpenTransact(true)
    }

    if (label === "Balances") {
      setOpenBalance(true)
    }
  };

  const closeAll = () => {
    setShowRegister(false);
    setShowLogin(false);
  };

  const links = (currentUser) => {

    return [
      !currentUser && {
        label: "SignUp",
        form: <SignUpForm closeAll={closeAll} />,
      },
      !currentUser && {
        label: "Login",
        form: <SignInForm closeAll={closeAll} />,
      },
      currentUser && { label: "Balances" },
      currentUser && { label: "History" },
      currentUser && { label: "Contribution" },
      currentUser && { label: "Logout" },
    ]
      .filter((linkConfig) => linkConfig)
      .map(({ label, form }, index) => {
        return (
          <>
            <Button
              style={{
                right: index % 2 === 1 ? "10px" : "14px",
                position: "relative",
              }}
              onClick={() =>
                !currentUser ? handleOpen(label) : handleActionLog(label)
              }
              disableRipple={true}
            >
              {label}
            </Button>
            {!currentUser && (
              <Dialog
                maxWidth
                onClose={() => handleClose(label)}
                aria-labelledby="simple-dialog-title"
                open={label === "SignUp" ? showRegister : showLogin}
                scroll="body"
              >
                <Fade in={label === "SignUp" ? showRegister : showLogin}>
                  {form}
                </Fade>
              </Dialog>
            )}
          </>
        );
      });
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="row"
        style={{ marginBottom: "4px" }}
      >
        <Grid
          item
          xs
          align="start"
          style={{ left: "10px", position: "relative" }}
        >
          <Button disableRipple={true}>
            {location.pathname === "/"
              ? "Home"
              : location.pathname.replace("/tag/", "")}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            onClick={() => {
              history.push("/");
              window.location.reload();
            }}
            disableRipple={true}
          >
            ITB MarketPlace
          </Button>
        </Grid>
        <Grid item xs align="end">
          {user && links(user.currentUser)}
        </Grid>
      </Grid>

      <Dialog
        open={openClick}
        TransitionComponent={Transition}
        onClose={() => handleClickClose()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        scroll="body"
        // keepMounted
        // fullWidth
        // PaperComponent={TagAll}
      >
        {user && user.currentUser && (
          <Contribute openClick={openClick} userId={user.currentUser.id} />
        )}
      </Dialog>


      <Dialog
          open={openTransact}
          TransitionComponent={Transition}
          onClose={() => handleClickClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="md"
          scroll="body"
          // keepMounted
          // fullWidth
          // PaperComponent={TagAll}
      >
        {user && user.currentUser && (
            <Transact openClick={openTransact} userId={user.currentUser.id} />
        )}
      </Dialog>

      <Dialog
          open={openBalance}
          TransitionComponent={Transition}
          onClose={() => handleClickClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="md"
          scroll="body"
          // keepMounted
          // fullWidth
          // PaperComponent={TagAll}
      >
        {user && user.currentUser && (
            <Balance openClick={openBalance} userId={user.currentUser.id} />
        )}
      </Dialog>
    </div>



  );
};
