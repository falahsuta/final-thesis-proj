import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { Info } from "@mui-treasury/components/info";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";

import Picks from "../card/Picks";
import { getContributePost, closeContribe } from "../../actions";

export default (props) => {
  const markProps = "markprops";
  const items = useSelector((state) => state.contribe);
  const dispatch = useDispatch();

  // const getRequiredPost = async () => {
  if (!items) {
    dispatch(getContributePost(props.userId));
  }
  // };

  const spacing = (num) => {
    return <div style={{ marginTop: "3px", width: "30px", height: num }}></div>;
  };

  console.log(items);

  return (
    <>
      {items && items.length > 0 && (
        <Grid container direction="row" justify="center" alignItems="center">
          {spacing("100px")}
          <Info useStyles={useD01InfoStyles}>
            <Typography color="textPrimary" variant="h5" component="h2">
              {"Your DissCuss".toUpperCase()}
            </Typography>

            {spacing("10px")}
          </Info>

          <Paper style={{ marginLeft: "65px" }} elevation={0}>
            <Picks items={items} markProps={markProps} />
          </Paper>
          {spacing("40px")}
        </Grid>
      )}
      {items && items.length === 0 && (
        <Grid
          container
          direction="columns"
          justify="center"
          alignItems="center"
        >
          <div
            style={{
              width: "400px",
              height: "80px",
              marginLeft: "80px",
              marginTop: "40px",
            }}
          >
            <Typography color="textPrimary" variant="h5" component="h3">
              You have no contribution yet.
            </Typography>
          </div>
        </Grid>
      )}
    </>
  );
};
