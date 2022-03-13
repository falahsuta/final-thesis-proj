import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ReplyRoundedIcon from "@material-ui/icons/ReplyRounded";
import Button from "@material-ui/core/Button";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import onClickOutside from "react-onclickoutside";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { useSelector } from "react-redux";
import axios from "axios";

// import { commentData } from "./mock-data";
import ReplyField from "./ReplyField";
import ReplyTag from "./ReplyTag";

const useStyles = makeStyles({
  root: {
    maxWidth: 415,
    backgroundColor: "transparent",
  },
});

const Comment = ({ comment }) => {
  const user = useSelector((state) => state.user);
  const classes = useStyles();
  const [showReply, setShowReply] = useState(false);

  const replyTrueIfClicked = () => {
    setShowReply(!showReply);
  };

  const getRandom = () => {
    const num = Math.random();
    if (num < 0.5) return 0;
    else return 1;
  };

  const nestedComments = (comment.replies || []).map((comment) => {
    return <Comment key={comment._id} comment={comment} type="child" />;
  });

  const spacing = (num) => {
    return <div style={{ marginTop: "3px", width: "30px", height: num }}></div>;
  };

  const cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <div style={{ marginLeft: "20px", marginTop: "-48px" }}>
        <Card className={classes.root} elevation={0}>
          <CardContent mt={3}>
            <Typography gutterBottom variant="body2" component="h3">
              {`${cap(comment.username)} • Sept 12`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {comment.body}
            </Typography>
            {!user.currentUser && spacing("30px")}
            {user && user.currentUser && (
              <Grid
                container
                direction="row-reverse"
                justify="flex-start"
                alignItems="flex-start"
              >
                {showReply ? (
                  <ReplyField
                    commentToId={comment._id}
                    action={replyTrueIfClicked}
                    userId={user.currentUser.id}
                    username={user.currentUser.username.slice(
                      0,
                      user.currentUser.username.indexOf("@")
                    )}
                  />
                ) : (
                  <>
                    <ReplyTag buttonText="Reply" action={replyTrueIfClicked}>
                      <ReplyRoundedIcon />
                    </ReplyTag>

                    <ReplyTag
                      buttonText={getRandom().toString()}
                      widthSpec={30}
                    >
                      <KeyboardArrowUpOutlinedIcon />
                    </ReplyTag>
                  </>
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
        {nestedComments}
      </div>
    </>
  );
};

export default (props) => {
  return (
    <div>
      <br />
      <br />
      {props.comment.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
};
