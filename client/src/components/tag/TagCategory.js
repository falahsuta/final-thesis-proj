import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Row, Column, Item } from "@mui-treasury/components/flex";
import {
  Info,
  InfoTitle,
  InfoSubtitle,
  InfoCaption,
} from "@mui-treasury/components/info";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { closeFirstPost } from "../../actions";
import TagAll from "./TagAll";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default React.memo(function DarkRapListItem() {
  const history = useHistory();
  const dispatch = useDispatch();
  const avatarStyles = useDynamicAvatarStyles({ size: 70 });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // https://music-artwork.com/wp-content/uploads/2020/06/preview_artwork072.jpg
  // https://music-artwork.com/wp-content/uploads/2018/04/dec110.jpg ==>> rnb
  const tags = [
    {
      name: "Quirk",
      link:
        "https://shopage.s3.amazonaws.com/media/f855/580321926366_PEnByxR6Xdn7soyNMiGPG4ZPMng1N4CN4D4XvB7j.jpg",
      caption: "Most Popular Genre Around",
    },
    {
      name: "Bizzare",
      link:
        "https://music-artwork.com/wp-content/uploads/2020/05/preview_artwork55.jpg",
      caption: "Bizzare Things Around",
    },
    {
      name: "Cool",
      link:
        "https://music-artwork.com/wp-content/uploads/2018/04/artwork_music-2.jpg",
      caption: "The coolest thing you'd find",
    },
    {
      name: "Informative",
      link:
        "https://music-artwork.com/wp-content/uploads/2020/05/preview_artwork34-1.jpg",
      caption: "You'll find it useful",
    },
  ];

  const renderTag = tags.map((tag) => {
    return (
      <Row mt={1}>
        <Item>
          <Avatar variant={"rounded"} classes={avatarStyles} src={tag.link} />
        </Item>
        <Info useStyles={useD01InfoStyles}>
          <InfoCaption>{tag.caption}</InfoCaption>
          <InfoTitle>
            <Typography color="textPrimary">{tag.name}</Typography>
          </InfoTitle>
          {/* <Link to="/yes"> */}
          <InfoCaption
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push(`/tag/${tag.name.toLowerCase()}`);
              dispatch(closeFirstPost());
              // window.location.reload();
            }}
          >
            {`t/${tag.name.toLowerCase()}`}>
          </InfoCaption>
          {/* </Link> */}
        </Info>
      </Row>
    );
  });

  return (
    <>
      <Column gap={2}>{renderTag}</Column>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Column
          gap={2}
          style={{
            marginBottom: "-33px",
            marginTop: "-38px",
            cursor: "pointer",
          }}
        >
          <Info useStyles={useD01InfoStyles}>
            <InfoCaption>
              <ArrowDropDownRoundedIcon onClick={handleClickOpen} />
            </InfoCaption>
          </Info>
        </Column>
      </Grid>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        // fullWidth
        maxWidth="lg"
        // PaperComponent={TagAll}
      >
        <TagAll />
      </Dialog>
    </>
  );
});
