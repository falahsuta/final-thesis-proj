import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ReplyRoundedIcon from "@material-ui/icons/ReplyRounded";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import { useSelector } from "react-redux";

import ReplyTag from "../reply/ReplyTag";
import Comment from "../reply/Comment";
import ReplyField from "../reply/ReplyField";

import GroupedButtonTransact from "./GroupedButtonTransact";
import ImageList from "./ImageList";
import Cookies from "js-cookie";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    maxWidth: 625,
  },
});

export default (props) => {
  const classes = useStyles();
  // const post = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);

  const [post, setPost] = useState();
  const [showReply, setShowReply] = useState(false);

  const [discountObj, setDiscountObj] = useState();

  const replyTrueIfClicked = () => {
    setShowReply(!showReply);
  };

  const fetchDiscount = async () => {
    let url = `http://localhost:8080/discounts/${parseInt(props.discountId)}`
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.get(
          url,
          config
      );

      setDiscountObj(response.data)

      console.log(response.data)
    } catch (err) {

    }
  }

  React.useEffect(() => {
    fetchDiscount();
  }, [])

  const fetchItem = async () => {
    let url = `http://localhost:8080/items/${props.id}`
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.get(
          url,
          config,
      )

      setPost(response.data)

    } catch (err) {
      setPost([])
    }
  }

  React.useEffect(() => {
    fetchItem()
  }, [])

  const getRandom = () => {
    const num = Math.random();
    if (num < 0.7) return 0;
    else return 1;
  };

  return (
    <Card className={classes.root}>
      <br />
      {post ? (
        <CardContent>
          <Container>
            <Typography gutterBottom variant="h5" component="h2">
              {post.title ? post.title : ""}
            </Typography>
            <div style={{ marginTop: "10px" }}></div>
            {post && <ImageList itemData={post.images}/>}
            <div style={{ marginTop: "15px" }}></div>
            <Typography
              variant="body1"
              color="textPrimary"
              component="p"
              align="justify"
            >
              {post ? post.description : ""}
            </Typography>
            {/*<div style={{ marginTop: "25px" }}></div>*/}
            {/*<ImageList />*/}
            {/*<div style={{ marginTop: "25px" }}></div>*/}
            <div style={{ height: "5px" }}></div>

            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              align="justify"
            >
              {post ? post.content : ""}

              <br />
              <div style={{marginTop: "30px"}}></div>
              <Typography variant="h7" color="textPrimary">
              Informasi Pembelian:
              </Typography>
              <br />
              <div style={{marginTop: "5px"}}></div>
              {(props.discountId == 0) ? (
                  <>
                    Discount: No Discount Usage
                  </>
              ) : discountObj && (
                  <>

                    Discount Code: {discountObj.name}, Percent Cut: {discountObj.percent_cut*100}%, Fixed Cut: Rp. {discountObj.fixed_cut.toLocaleString()}, Whole Opts: {discountObj.wholy == "true" ? "Yes" : " No"}
                  </>
              )}


              <div style={{marginTop: "5px"}}></div>


              {/*<br />*/}

                Total Pembayaran: {`Rp. ${props.totalBuyPrice}`}, Unit Pembelian: {props.totalQty}


            </Typography>

            <br />
            {user && user.currentUser && (
              <Grid
                container
                direction="row-reverse"
                justify="flex-start"
                alignItems="flex-start"
              >
                {showReply ? (
                    <>
                      <ReplyField
                        postId={props.id}
                        action={replyTrueIfClicked}
                        userId={user.currentUser.id}
                        username={user.currentUser.username.slice(
                          0,
                          user.currentUser.username.indexOf("@")
                        )}
                      />
                    </>
                ) : (
                  <>
                    {post.price && <GroupedButtonTransact totalQty={post.quantity} price={post.price}/>}

                  </>
                )}
              </Grid>
            )}
            <Divider />

          </Container>


        </CardContent>
      ) : undefined}

      {/*<br />*/}
    </Card>
  );
};
