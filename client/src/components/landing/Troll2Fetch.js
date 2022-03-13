import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import Picks from "../card/Picks";

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

const Scroll2Fetch = (props) => {
  const { tag } = props;

  const [items, setItems] = useState(props.timeline.docs);
  const [currIdx, setCurrIdx] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [totalDocument, setTotalDocument] = useState(props.timeline.totalDocs);

  const fetchMoredata = async () => {
    if (items.length >= totalDocument) {
      setHasMore(false);
      return;
    }

    const response = await axios.get(
      `http://localhost:4002/api/posts/?${
        tag ? `t=${tag}&` : ""
      }limit=6&page=${currIdx}`
    );

    setTimeout(() => {
      setItems((prevItems) => prevItems.concat(response.data.docs));
      setCurrIdx((prevIndex) => prevIndex + 1);
    }, 1000);
  };

  const renderInfinite = () => {
    return (
      <>
        {items.length > 0 && (
          <InfiniteScroll
            pagestart={1}
            dataLength={items.length}
            next={fetchMoredata}
            hasMore={hasMore}
            loader={<h4>Keep Scroll Down For More...</h4>}
            endMessage={
              <p>
                <b>Yay! You have seen it all</b>
              </p>
            }
            scrollThreshold={0.5}
          >
            <Picks tag={tag} items={items} />

            <br />
          </InfiniteScroll>
        )}

        {items.length === 0 && (
          <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Typography variant="subtitle1" align="center">
              Posts are empty, start something!
            </Typography>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      {tag ? renderInfinite() : <Container>{renderInfinite()}</Container>}
    </div>
  );
};

export default Scroll2Fetch;
