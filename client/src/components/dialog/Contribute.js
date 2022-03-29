import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { Info } from "@mui-treasury/components/info";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";

import Picks from "../card/Picks";
import { getContributePost, closeContribe } from "../../actions";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

import {ChevronLeft, ChevronRight} from '@material-ui/icons';

export default (props) => {
  const markProps = "markprops";
  // const items = useSelector((state) => state.contribe);
  const items = [
    {
      title: "The Big Bang may be a black hole inside another universe",
      image:
          "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
      tag: "cool",
      id: "5f48af7abadaf00740940462",
      name: "GoGetInfo",
    },
    {
      title: "The Dark Forest Theory of the Universe",
      image: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
      tag: "bizzare",
      id: "5f487bfbafa4a1520807c12b",
      name: "FastInfo",
    },
    {
      title: "Is the Universe Real? And Experiment Towards",
      image: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
      tag: "soul",
      id: "5f48ac2ebadaf00740940456",
      name: "FunAndNice",
    },
  ]

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
        {items && items.length < 0 && (
            <Grid container direction="row" justify="center" alignItems="center">
              {spacing("100px")}
              <Info useStyles={useD01InfoStyles}>
                <Typography color="textPrimary" variant="h5" component="h2">
                  {"Your History".toUpperCase()}
                </Typography>

                {spacing("10px")}
              </Info>

              {/*<Paper style={{ marginLeft: "65px" }} elevation={0}>*/}
              <div style={{ marginLeft: "65px" }}>
                {items.length <= 3 && (
                    <>
                      {spacing("30px")}
                    </>
                )}
                <Picks items={items} markProps={markProps} />

                {items.length <= 3 && (
                    <>
                      {spacing("30px")}
                    </>
                )}
              </div>
              {/*</Paper>*/}
              <div>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                  <Button>One</Button>
                  <Button>Two</Button>
                </ButtonGroup>
              </div>
              {/*{spacing("40px")}*/}



            </Grid>
        )}

        {items && items.length > 0 && (
            <Grid container spacing={2} direction="row" justify="center" alignItems="center" style={{margin: "10px"}}>
              <Grid item xs={4} md={4}>
                <Info useStyles={useD01InfoStyles} style={{marginLeft: "10px"}}>
                  <Typography color="textPrimary" variant="h5" component="h2">
                    {"Your Inventory".toUpperCase()}
                  </Typography>
                  {spacing("10px")}
                </Info>
              </Grid>
              <Grid item xs={4} md={4}>
                <div style={{marginLeft: "-40px"}}>
                  <Picks items={items} markProps={markProps} />
                </div>
              </Grid>
              <Grid item xs={3} md={3}>
                <ButtonGroup variant="outlined" aria-label="outlined button group" style={{marginLeft: "90px"}}>
                  <Button><ChevronLeft /></Button>
                  <Button><ChevronRight /></Button>
                </ButtonGroup>
              </Grid>
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
