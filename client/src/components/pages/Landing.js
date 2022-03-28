import React from "react";
import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useSelector, useDispatch } from "react-redux";

import { getFirstPost, fetchTag } from "../../actions";
import Recommend from "../landing/Recommend";
import Header from "../header/Header";
import headerData from "../header/header-data";
import PostCreate from "../dialog/PostCreate";
import Troll3Fetch from "../landing/Troll3Fetch";

import Troll2Fetch from "../landing/Troll2Fetch";

export default () => {
  const timeline = useSelector((state) => state.timeline);
  const dispatch = useDispatch();

  const getRequiredPost = async () => {
      await dispatch(fetchTag());
      await dispatch(getFirstPost());
  };

  if (!timeline) {
    getRequiredPost();
  }

  return (
    <>
      <Container>
        <Box my={2}>
          <Header post={headerData} />
        </Box>
      </Container>
      <PostCreate />
      <Recommend />
      {timeline && <Troll3Fetch timeline={timeline} />}
    </>
  );
};
