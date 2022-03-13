import React from "react";
import Typography from "@material-ui/core/Typography";
import { Container, requirePropFactory, Card } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import GoogleFontLoader from "react-google-font-loader";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";
import {
  Info,
  InfoTitle,
  InfoSubtitle,
  InfoCaption,
} from "@mui-treasury/components/info";
import Sticky from "react-stickynode";
import NoSsr from "@material-ui/core/NoSsr";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";

import HorizontalCard from "../card/HorizontalCard";
import TagCard from "../tag/TagCard";
import TagCategory from "../tag/TagCategory";

export default () => {
  const dataMiddle = [
    {
      title: "The Big Bang may be a black hole inside another universe",
      imglink:
        "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
      tag: "cool",
      id: "5f48af7abadaf00740940462",
      name: "GoGetInfo",
    },
    {
      title: "The Dark Forest Theory of the Universe",
      imglink: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
      tag: "bizzare",
      id: "5f487bfbafa4a1520807c12b",
      name: "FastInfo",
    },
    {
      title: "Is the Universe Real? And Experiment Towards",
      imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
      tag: "soul",
      id: "5f48ac2ebadaf00740940456",
      name: "FunAndNice",
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
          reference={element.reference}
          id={element.id}
          name={element.name}
        />
        <Divider
          style={{
            margin: "13px 0",
            width: "355px",
            display: index === datalength ? "none" : undefined,
          }}
          variant="middle"
        />
      </>
    );
  });

  return (
    <React.Fragment>
      {/* <NoSsr> */}
      <GoogleFontLoader fonts={[{ font: "Barlow", weights: [400, 600] }]} />
      {/* </NoSsr> */}
      <Container>
        <Info useStyles={useD01InfoStyles} mb={1}>
          <InfoTitle>
            <Typography color="textPrimary">
              {"Trending Today".toUpperCase()}
            </Typography>
          </InfoTitle>
        </Info>
      </Container>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        // spacing={2}
      >
        <Grid item xs={4}>
          <TagCard />
        </Grid>
        <Grid item xs={4}>
          <div style={{ marginLeft: "30px", marginTop: "10px" }}>
            {renderMiddle}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Sticky top={55} enableTransforms={false}>
            <div>
              <Paper
                // className="unblur-1 unblur-2"
                style={{
                  width: "84%",
                  marginLeft: "33px",
                }}
              >
                <TagCategory />
              </Paper>
            </div>
          </Sticky>
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Container>
        <Info useStyles={useD01InfoStyles} mb={1}>
          <InfoTitle>
            <Typography color="textPrimary">
              {"Our Picks Entry".toUpperCase()}
            </Typography>
          </InfoTitle>
        </Info>
      </Container>
    </React.Fragment>
  );
};
