import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Sticky from "react-stickynode";
import Typography from "@material-ui/core/Typography";
import {
  Info,
  InfoTitle,
  InfoSubtitle,
  InfoCaption,
} from "@mui-treasury/components/info";
import Header from "../header/Header";
import headerData from "../header/header-data";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";
import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useSelector, useDispatch } from "react-redux";

import { getTagPost } from "../../actions";
import Troll2Fetch from "../landing/Troll2Fetch";
import TagCategory from "../tag/TagCategory";

export default (props) => {
  const timeline = useSelector((state) => state.timeline);
  const dispatch = useDispatch();

  const getRequiredPost = async () => {
    await dispatch(getTagPost(props.match.params.tag));
  };

  if (!timeline) {
    getRequiredPost();
  }

  const cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div style={{ marginLeft: "30px" }}>
      <Box my={2} mr={3}>
        <Header post={headerData} tag={`t/${cap(props.match.params.tag)}`} />
      </Box>

      <br />
      <br />
      <Info useStyles={useD01InfoStyles} mb={1}>
        <InfoTitle>
          <Typography color="textPrimary">
            {"Our Picks Entry".toUpperCase()}
          </Typography>
        </InfoTitle>
      </Info>

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={8} wrap="nowrap">
          <div style={{ height: "3px" }}></div>
          {timeline && (
            <Troll2Fetch timeline={timeline} tag={props.match.params.tag} />
          )}
        </Grid>
        <Grid item xs={3} style={{ marginLeft: "40px" }}>
          <Sticky top={55} enableTransforms={false}>
            <Paper style={{ width: "110%" }}>
              <TagCategory />
            </Paper>
          </Sticky>
        </Grid>
      </Grid>
    </div>
  );
};
