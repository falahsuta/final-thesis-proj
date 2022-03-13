import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles(() => ({
  image: {
    width: "100%",
  },
}));

export default (props) => {
  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={1}>
          <Skeleton
            variant="rect"
            width="104px"
            style={{ height: "105px", borderRadius: "5px" }}
          ></Skeleton>
        </Grid>

        <Grid item xs={2}>
          <div
            style={{
              marginLeft: "86px",
              marginTop: "5px",
              position: "absolute",
            }}
          >
            <Skeleton width="230px">
              <Typography variant="body1">.</Typography>
            </Skeleton>
            <Skeleton width="200px">
              <Typography variant="caption">.</Typography>
            </Skeleton>
            <br />
            <Skeleton width="190px" style={{ height: "17px" }}>
              <Typography variant="caption">.</Typography>
            </Skeleton>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
