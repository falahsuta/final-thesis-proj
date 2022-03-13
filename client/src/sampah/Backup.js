import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import HorizontalCard from "./HorizontalCard";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import SkeletonCard from "./SkeletonCard";

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

const Scroll2Fetch = () => {
  const dataMiddle = [
    {
      title: "The Big Bang may be a black hole inside another universe",
      imglink:
        "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
      tag: "Space",
    },
    {
      title: "The Dark Forest Theory of the Universe",
      imglink: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
      tag: "Wild",
    },
    {
      title: "Is the Universe Real? And Experiment Towards",
      imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
      tag: "Philosophy",
    },
  ];

  const datalength = dataMiddle.length - 1;
  const renderMiddle = dataMiddle.map((element, index) => {
    return (
      <>
        <HorizontalCard
          title={element.title}
          imglink={element.imglink}
          tag={element.tag}
        />
        <Divider
          light
          style={{
            margin: "13px 0",
            height: index === 0 ? "0.6px" : "1px",
            width: "355px",
            display: index === datalength ? "none" : undefined,
          }}
          // variant="middle"
        />
      </>
    );
  });

  const [items, setItems] = useState([]);
  const [currIdx, setCurrIdx] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalDocument, setTotalDocument] = useState(40);

  const fetchMoredata = async () => {
    if (items.length >= totalDocument) {
      setHasMore(false);
      return;
    }

    const response = await axios.get(
      `http://localhost:4002/api/posts/?limit=6&page=${currIdx}`
    );
    setItems((prevItems) => prevItems.concat(response.data.docs));
    setCurrIdx((prevIndex) => prevIndex + 1);
    setTotalDocument(response.data.totalDocs);
  };

  useEffect(async () => {
    const response = await axios.get(
      `http://localhost:4002/api/posts/?limit=6&page=${currIdx}`
    );
    setItems(response.data.docs);
    setCurrIdx(currIdx + 1);
    console.log(response.data.docs);
  }, []);

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        // spacing={2}
      >
        <Grid item xs={4}>
          {renderMiddle}
        </Grid>
        <Grid item xs={4} style={{ marginLeft: "25px" }}>
          {renderMiddle}
        </Grid>
      </Grid>
      {/* <InfiniteScroll
        dataLength={items.length}
        next={fetchMoredata}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map((item) => {
          return (
            <div>
              {item.testing} - {item._id}
            </div>
          );
        })}
      </InfiniteScroll> */}
    </Container>
  );
};

export default Scroll2Fetch;
