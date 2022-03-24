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
  const tags = useSelector((state) => state.tag);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // https://music-artwork.com/wp-content/uploads/2020/06/preview_artwork072.jpg
  // https://music-artwork.com/wp-content/uploads/2018/04/dec110.jpg ==>> rnb


  const renderTag = tags ? tags.slice(0,4).map((tag) => {
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
  }) : undefined;

  return (
    <>
        {tags && tags.length > 0 && (
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
        )}

    </>
  );
});
