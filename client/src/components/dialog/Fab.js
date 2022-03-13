import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NavigationIcon from "@material-ui/icons/Navigation";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabStyle: {
    zIndex: 299,
    right: 150,
    bottom: 30,
    position: "fixed",
  },
}));

export default function FloatingActionButtonSize() {
  const classes = useStyles();

  return (
    <div className={classes.fabStyle}>
      <div>
        <Fab
          size="medium"
          color="secondary"
          aria-label="add"
          className={classes.margin}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
}
