import React from "react";
import TextField from "@material-ui/core/TextField";
import onClickOutside from "react-onclickoutside";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import OutsideClickHandler from "react-outside-click-handler";
import axios from "axios";

import ReplyTag from "./ReplyTag";
import { fetchPost, commentPost, commentReply } from "../../actions";

const ReplyField = function (props) {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);

  const IdPost = post.post._id;
  const [replytext, setReplyText] = React.useState("");
  const handleChange = (event) => {
    setReplyText(event.target.value);
  };

  const sendCommentToServer = async () => {
    const { postId, userId, username } = props;
    const body = replytext;

    const value = {
      postId,
      body,
      userId,
      username,
    };

    // console.log(props.userId);
    dispatch(commentPost(value));
    dispatch(fetchPost(postId));
    setReplyText("");
    props.action();
  };

  const thisFromReplies = async () => {
    const { commentToId, userId, username } = props;
    // console.log(commentToId);
    const body = replytext;

    const val = {
      commentToId,
      body,
      username,
      userId,
    };

    // console.log(val);

    await dispatch(commentReply(val));

    dispatch(fetchPost(IdPost));
    setReplyText("");
    props.action();
  };

  const actionWhenClick = () => {
    sendCommentToServer();
  };

  const label = `Comment as ${props.username}`;

  return (
    <>
      <Grid
        container
        direction="row-reverse"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs={2}>
          <ReplyTag
            action={props.postId ? actionWhenClick : thisFromReplies}
            buttonText="Create"
            heightSpec={35}
          />
        </Grid>
        <Grid item xs={10}>
          <OutsideClickHandler
            onOutsideClick={() => {
              replytext === "" ? props.action() : (function () {})();
            }}
          >
            <TextField
              value={replytext}
              onChange={handleChange}
              size="small"
              id="outlined-textarea"
              label={label}
              fullWidth
              placeholder="Your Comment.."
              multiline
              variant="outlined"
              style={{
                borderRadius: 50,
                marginTop: "12px",
                marginBottom: "18px",
                width: "98%",
              }}
            />
          </OutsideClickHandler>
        </Grid>
      </Grid>
    </>
  );
};

export default ReplyField;
