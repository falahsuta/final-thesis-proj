import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { Info } from "@mui-treasury/components/info";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";

import Picks from "../card/Picks";
import { getContributePost, closeContribe } from "../../actions";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

import {ChevronLeft, ChevronRight} from '@material-ui/icons';
import Cookies from "js-cookie";
import axios from "axios";

export default (props) => {
  const markProps = "markprops";

  const [topup, setTopup] = useState();
  const [currPage, setCurrpage] = useState(1);



  const spacing = (num) => {
    return <div style={{ marginTop: "3px", width: "30px", height: num }}></div>;
  };

  const fetchActivate = async () => {
    let url = `http://localhost:8080/itemsmy?limit=3&page=${currPage}`
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.get(
          url,
          config,
      )

      setTopup(response.data)
    } catch (err) {
      setTopup([])
    }
  }

  React.useEffect(() => {
    fetchActivate()
  }, [currPage])

  const kanan = () => {
    setCurrpage((value) => value+1);
  }

  const kiri = () => {
    setCurrpage((value) => value-1);
  }



  return (
      <>
        {topup && topup["items"] && topup["items"].length > 0 && (
            <Grid container spacing={2} direction="row" justify="center" alignItems="center" style={{margin: "10px"}}>
              <Grid item xs={4} md={4}>
                <Info useStyles={useD01InfoStyles} style={{marginLeft: "10px"}}>
                  <Typography color="textPrimary" variant="h5" component="h2">
                    {"Your Inventory".toUpperCase()}
                  </Typography>
                  {spacing("10px")}
                </Info>
              </Grid>
              <Grid item xs={4} md={4}>
                <div style={{marginLeft: "-40px"}}>
                  <Picks items={topup["items"]} markProps={markProps} />
                </div>
              </Grid>
              <Grid item xs={3} md={3}>
                <ButtonGroup variant="outlined" aria-label="outlined button group" style={{marginLeft: "90px"}}>
                  <Button disabled={currPage == 1} onClick={() => kiri()}><ChevronLeft /></Button>
                  <Button disabled={Math.ceil(topup.total_counts / 3) == currPage} onClick={() => kanan()}><ChevronRight /></Button>
                </ButtonGroup>
                <div style={{marginLeft: "110px", marginTop: "20px"}}>Page {currPage} / {Math.ceil(topup.total_counts / 3)}</div>
              </Grid>
            </Grid>
        )}

        {/* masih error ini kalau kosong */}
        {topup && topup.items && topup.items.length === 0 && (
            <Grid
                container
                direction="columns"
                justify="center"
                alignItems="center"
            >
              <div
                  style={{
                    width: "400px",
                    height: "80px",
                    marginLeft: "80px",
                    marginTop: "40px",
                  }}
              >
                <Typography color="textPrimary" variant="h5" component="h3">
                  You have no contribution yet.
                </Typography>
              </div>
            </Grid>
        )}
      </>
  );
};
