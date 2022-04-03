import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import NoSsr from "@material-ui/core/NoSsr";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import GoogleFontLoader from "react-google-font-loader";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import { fetchPost, closePost } from "../../actions";
import PostShowTransact from "../dialog/PostShowTransact";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: 355,
    height: 105,
    backgroundColor: "transparent",
  },
  rootOvd: {
    display: "flex",
    width: 390,
    height: 105,
    backgroundColor: "transparent",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
    position: "absolute",
    top: "-9px",
    // marginBottom: "40px",
  },
  cover: {
    borderRadius: "3px",
    width: 145,
    // marginTop: "14px",
    // marginLeft: "12px",
    // height: 90,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    height: "90%",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default (props) => {
  // console.log(props.data)
  // console.log(props.user)

  // const {productId, buyQuantity, discountId} = props.data.buyer_meta.split(",")
  const buyer_meta = props.data.buyer_meta.split(",")

  const productId = buyer_meta[0]
  const buyQuantity = buyer_meta[1]
  const discountId = buyer_meta[2]

  const totalBuyer = (parseFloat(props.data.buyer_total_bill.split(".")[0])).toLocaleString()



  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    // dispatch(fetchPost(props.id));
    setOpen(true);
  };

  const handleClose = () => {
    // dispatch(closePost());
    setOpen(false);
  };

  return (
    <>
      <NoSsr>
        <GoogleFontLoader fonts={[{ font: "Barlow", weights: [400, 600] }]} />
      </NoSsr>
      <Card
        className={props.markProps ? classes.rootOvd : classes.root}
        elevation={0}
        style={{ cursor: "pointer" }}
        onClick={handleOpen}
      >
        {/*<CardMedia*/}
        {/*    className={classes.cover}*/}
        {/*    image={props.imglink}*/}
        {/*    title="Live from space album cover"*/}
        {/*/>*/}
        <CardActionArea>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="subtitle2">{new Date(props.data.created_at).toString().split(" ").slice(0,5).join(" ")}</Typography>
              <div style={{marginTop: "8px"}}></div>

              {/*<Typography variant="caption" color="textSecondary">*/}
              {/*  {props.user.currentUser.nickname}*/}
              {/*</Typography>*/}
              {/*<Typography variant="caption" color="textPrimary">*/}
              {/*  {`t/${props.tag}`}*/}
              {/*</Typography>*/}


              <Typography variant="caption" color="textSecondary" style={{marginTop: "20px"}}>
                {/*{`Price: Rp. ${props.price ? props.price.toLocaleString() : props.price}, Qty: ${props.quantity ? props.quantity.toLocaleString() : props.quantity}`}*/}
                Total Bayar: Rp. {totalBuyer}, Total Unit: {(parseInt(parseFloat(buyQuantity)))}
              </Typography>

              <br />
              <div style={{marginTop: "7px"}}>
                <Typography variant="caption" color="textPrimary">
                  Click to see Product's Detail
                </Typography>

              </div>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>

      <Dialog
        maxWidth
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        scroll="body"
      >
        <Fade in={open}>
          <PostShowTransact id={parseInt(productId)} discountId={discountId} totalBuyPrice={totalBuyer} totalQty={(parseInt(parseFloat(buyQuantity)))}/>
        </Fade>
      </Dialog>
    </>
  );
};
