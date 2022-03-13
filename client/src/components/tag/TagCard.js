import React from "react";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useCoverCardMediaStyles } from "@mui-treasury/styles/cardMedia/cover";
import { useLightTopShadowStyles } from "@mui-treasury/styles/shadow/lightTop";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 354,
    margin: "auto",
    borderRadius: 5,
    position: "relative",
  },
  content: {
    padding: 24,
  },
  cta: {
    display: "block",
    textAlign: "center",
    color: "#fff",
    letterSpacing: "3px",
    fontWeight: 200,
    fontSize: 12,
  },
  title: {
    color: "#fff",
    letterSpacing: "2px",
  },
}));

export const NewsCard2Demo = React.memo(function NewsCard2() {
  const styles = useStyles();
  const mediaStyles = useCoverCardMediaStyles();
  const shadowStyles = useLightTopShadowStyles();
  const tags = [
    {
      name: "Space",
      bigcapt: "The space between the stars and galaxies is largely empty.",
      imglink:
        "https://images.unsplash.com/photo-1519810755548-39cd217da494?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
    },
    // 'BIZZARE',
    // 'COOL',
    // 'INFORMATIVE',
    // 'TECH',
    // 'RNB',
    // 'SOUL',
    // 'POP',
    // 'STUDY_TIPS',
  ];

  const choosen = tags[Math.floor(Math.random() * tags.length)];

  return (
    <Card className={cx(styles.root, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          // "https://images.unsplash.com/photo-1519810755548-39cd217da494?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
          "https://music-artwork.com/wp-content/uploads/2020/05/preview_artwork46.jpg"
        }
      />
      <CardActionArea>
        <CardContent className={styles.content}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            minHeight={320}
            color={"common.white"}
            textAlign={"center"}
          >
            <h1 className={styles.title}>{`t/${choosen.name}`}</h1>
            <p>{choosen.bigcapt}</p>
          </Box>
          <Typography className={styles.cta} variant={"overline"}>
            Explore
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default NewsCard2Demo;
