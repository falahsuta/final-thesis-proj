import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Row, Column, Item } from "@mui-treasury/components/flex";
import { Info, InfoTitle, InfoCaption } from "@mui-treasury/components/info";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { data1, data2, data3 } from "./tag-data";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { closeFirstPost } from "../../actions";

export default React.memo(function DarkRapListItem(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const avatarStyles = useDynamicAvatarStyles({ size: 70 });
  // https://music-artwork.com/wp-content/uploads/2020/06/preview_artwork072.jpg
  // https://music-artwork.com/wp-content/uploads/2018/04/dec110.jpg ==>> rnb

  const renderTag = (dataTag) => {
    return dataTag.map((tag) => {
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

            <InfoCaption
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push(`/tag/${tag.name.toLowerCase()}`);
                dispatch(closeFirstPost());
                window.location.reload();
              }}
            >
              {`t/${tag.name.toLowerCase()}`}>
            </InfoCaption>
          </Info>
        </Row>
      );
    });
  };

  return (
    <>
      <Paper>
        <div style={{ marginTop: "3px", width: "30px", height: "1px" }}></div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid items xs={4}>
            <Column gap={2}>{renderTag(data1)}</Column>
          </Grid>
          <Grid items xs={4}>
            <Column gap={2}>{renderTag(data2)}</Column>
          </Grid>
          <Grid items xs={4}>
            <Column gap={2}>{renderTag(data3)}</Column>
          </Grid>
        </Grid>
        <div
          style={{ marginBottom: "5px", width: "30px", height: "1px" }}
        ></div>
      </Paper>
    </>
  );
});
