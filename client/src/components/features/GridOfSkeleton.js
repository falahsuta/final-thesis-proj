import React from "react";
import Grid from "@material-ui/core/Grid";

import SkeletonCard from "./SkeletonCard";

const gridBlock = {
  height: "20px",
};

export default () => {
  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={4}>
          <SkeletonCard />
          <div style={gridBlock}></div>
          <SkeletonCard />
          <div style={gridBlock}></div>
          <SkeletonCard />
        </Grid>
        <Grid item xs={4} style={{ marginLeft: "25px" }}>
          <SkeletonCard />
          <div style={gridBlock}></div>
          <SkeletonCard />
          <div style={gridBlock}></div>
          <SkeletonCard />
        </Grid>
      </Grid>
    </>
  );
};
