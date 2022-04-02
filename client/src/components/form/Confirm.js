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
import Cookies from "js-cookie";
import axios from "axios";

// Destructure props
const Confirm = ({
  handleNext,
  handleBack,
  values: { title, description, image, tag, content, price, quantity },
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSend = async () => {
    if (user.currentUser.id) {
      const value = {
        title,
        content,
        description,
        "images": image.split(" "),
        "tag": tag.toLowerCase(),
        "author_id": user.currentUser.id,
        quantity: parseInt(quantity),
        price: parseFloat((price.split(".")[0]).replace(",", "")),
      };

      console.table(value);

      let p = Cookies.get('access_token')

      const config = {
        headers: {Authorization: `Bearer ${p}`},

      };

      // console.log(p)

      if (p) {
        try {
          const response = await axios.post(
              "http://localhost:8080/items",
              value,
              config,
          );

          console.log(response.data)


        } catch (err) {
          console.log(err.message())
        }


        // dispatch(createPost(value));
      }

      // dispatch(createPost(value));
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

        <ListItem>
          <ListItemText primary="Price" secondary={`Rp. ${cap(price).split(".")[0]}`} />
        </ListItem>

        <ListItem>
          <ListItemText primary="Quantity" secondary={cap(quantity)} />
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
