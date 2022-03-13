import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import { useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import Form from "../form/Form";
import Fab from "./Fab";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    height: "90%",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default () => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeAll = () => {
    setOpen(false);
  };

  return (
    <>
      {user && user.currentUser && (
        <div onClick={handleOpen} style={{ display: open ? "none" : "" }}>
          <Fab />
        </div>
      )}
      <Dialog
        maxWidth
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        scroll="body"
      >
        <Fade in={open}>
          <Form closeAll={closeAll} />
        </Fade>
      </Dialog>
    </>
  );
};
