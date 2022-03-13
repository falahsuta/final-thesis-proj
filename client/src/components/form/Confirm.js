import React, { Fragment } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Container, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { createPost } from "../../actions";
import { useDispatch } from "react-redux";

// Destructure props
const Confirm = ({
  handleNext,
  handleBack,
  values: { title, description, image, tag, content },
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSend = () => {
    if (user.currentUser.id) {
      const userId = user.currentUser.id;
      const username = user.currentUser.username;
      const value = {
        userId,
        title,
        description,
        image,
        tag: tag.toLowerCase(),
        content,
        userId,
        username: username.slice(0, username.indexOf("@")),
      };
      console.log(value);
      dispatch(createPost(value));
    }
  };

  return (
    <Fragment>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="Title" secondary={cap(title)} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Description" secondary={cap(description)} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Image Link" secondary={cap(image)} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Tag" secondary={cap(tag)} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Content" />
        </ListItem>
        <Typography variant="body2">
          <div
            style={{
              width: "95%",
              marginLeft: "18px",
              wordWrap: "break-word",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {cap(content)}
          </div>
        </Typography>
      </List>

      <div
        style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}
      >
        <Button variant="contained" color="default" onClick={handleBack}>
          Back
        </Button>
        <Button
          style={{ marginLeft: 20 }}
          variant="contained"
          color="secondary"
          onClick={() => {
            handleSend();
            handleNext();
          }}
        >
          Confirm & Continue
        </Button>
      </div>
    </Fragment>
  );
};

export default Confirm;
