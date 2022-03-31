import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { Info } from "@mui-treasury/components/info";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";

import Picks from "../card/Picks";

import { getContributePost, closeContribe } from "../../actions";
import Button from "@material-ui/core/Button";
import {ShoppingCart} from "@material-ui/icons";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

import {Check} from '@material-ui/icons';
import Success from "./Success";


export default (props) => {
  const markProps = "markprops";

  // const items = useSelector((state) => state.contribe);

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

  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState(false);


  const spacing = (num) => {
    return <div style={{ marginTop: "3px", width: "30px", height: num }}></div>;
  };

  const showSuccess = () => {
      setSuccess(true)
  }




  return (
    <>
        {success ?
            <>
                <div style={{margin: "30px"}}>
                    <Success />
                </div>
        </> : (<div style={{margin: "70px", marginTop: "60px"}}>
            {/*<Grid container direction="row" justify="center" alignItems="center" >*/}
            <div style={{marginBottom: "30px"}}>
                <Typography color="textPrimary" variant="h4" component="h2">
                    {"Your Bills".toUpperCase()}
                </Typography>
            </div>


            <div style={{marginBottom: "20px"}}>
                <Typography color="textPrimary" variant="subtitle1" component="h1">
                    Saldo Anda : Rp. 30.000.000
                </Typography>
            </div>

            <div style={{marginBottom: "20px"}}>
                <Typography color="textPrimary" variant="subtitle1" component="h1">
                    (Harga /unit: Rp. {props.price.toLocaleString()})
                </Typography>
            </div>


            <div style={{marginBottom: "-10px"}}>
                <Typography color="textPrimary" variant="subtitle1" component="h1">
                    Harga Total: Rp. {(props.price * props.qty).toLocaleString()}, Dengan Qty: {props.qty}
                </Typography>
            </div>

            <Grid container={true}>
                <TextField
                    size="small"
                    style={{width: "65%"}}
                    label="Discount Code"
                    name="discountcode"
                    placeholder="Your Discount Code"
                    defaultValue={""}
                    margin="normal"
                    // onChange={handleChange("quantity")}
                    // fullWidth
                    // error={filedError.quantity !== ""}
                    // helperText={
                    //     filedError.quantity !== "" ? `${filedError.quantity}` : ""
                    // }
                    // required
                />
                <Button size="small" variant="contained"
                        style={{marginLeft: "20px", height: "30%", marginTop: "35px"}}>Apply</Button>
            </Grid>
            Percentage Cut: 0%, Fixed Cut: Rp. 0


            <div style={{marginLeft: "90px"}}>

                <Button onClick={() => showSuccess()} size="medium" style={{height: "40%", marginTop: "55px"}}>
                    Confirm
                    <div style={{opacity: 0}}>{"x"}</div>
                    <Check/>
                </Button>
            </div>
        </div>)}
    </>
  );
};
