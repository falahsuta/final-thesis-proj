import React, {useState} from "react";
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
import Discount from "../dialog/Discount";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import {closeContribe, signOut} from "../../actions";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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

  const items = [
    {
      title: "The Big Bang may be a black hole inside another universe",
      image:
          "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
      tag: "cool",
      id: "5f48af7abadaf00740940462",
      name: "GoGetInfo",
    },
    {
      title: "The Dark Forest Theory of the Universe",
      image: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
      tag: "bizzare",
      id: "5f487bfbafa4a1520807c12b",
      name: "FastInfo",
    },
    {
      title: "Is the Universe Real? And Experiment Towards",
      image: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
      tag: "soul",
      id: "5f48ac2ebadaf00740940456",
      name: "FunAndNice",
    },
  ]

  const [openTransact, setOpenTransact] = useState(false);
  const choosen = tags[Math.floor(Math.random() * tags.length)];

  const handleActionLog = (label) => {
    setOpenTransact(true)
  };

  const handleClickClose = () => {
    setOpenTransact(false);
    // transition paused close for better unmounting contribes component
    setTimeout(() => {
      // dispatch(closeContribe());
    }, 300);
  };

  return (
      <>
        <Card className={cx(styles.root, shadowStyles.root)} onClick={()=>handleActionLog()}>
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

        <Dialog
            open={openTransact}
            TransitionComponent={Transition}
            onClose={() => handleClickClose()}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth="md"
            scroll="body"
            // keepMounted
            // fullWidth
            // PaperComponent={TagAll}
        >

          <Discount openClick={openTransact} />

        </Dialog>
      </>
  );
});

export default NewsCard2Demo;
