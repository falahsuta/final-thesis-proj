import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { Info } from "@mui-treasury/components/info";
import { useD01InfoStyles } from "@mui-treasury/styles/info/d01";

import Picks from "../card/Picks";

import {getContributePost, closeContribe, setBalanceDispatcher} from "../../actions";
import Button from "@material-ui/core/Button";
import {ShoppingCart} from "@material-ui/icons";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

import {Check} from '@material-ui/icons';
import Success from "./Success";
import Cookies from "js-cookie";
import axios from "axios";


export default (props) => {
  const markProps = "markprops";
  const user = useSelector((state) => state.user);


  console.log(props.product)

  const dispatch = useDispatch();

  const [balance, setBalance] = React.useState();
  const [discountedObj, setDiscountedObj] = React.useState({
    id: 0,
    fee: 0,
    percent: 0,
    wholy: "false",
  });

  const [success, setSuccess] = React.useState(false);

  const [discountname, setDiscountName] = React.useState();
  const [successButton, setSuccessButton] = React.useState("Apply");
  const [disconted, setDiscounted] = React.useState();


  const [price, setPrice] = React.useState(parseFloat(props.price * props.qty))

  const spacing = (num) => {
    return <div style={{ marginTop: "3px", width: "30px", height: num }}></div>;
  };

  const fetchBalance = async () => {
    let url = "http://localhost:8080/mybalances/check"
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.get(
          url,
          config
      );

      // console.log(response.data["current_balance"])

      let updated_balance = response.data["current_balance"].toLocaleString().replace("-", "")
      setBalance(updated_balance)


    } catch (err) {
      setBalance("Please Activate the Balance Services")
    }
  }

  const fetchDiscount = async () => {
    let url = `http://localhost:8080/discountsbyname/${discountname}`
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.get(
          url,
          config
      );

      if (response.data) {
        setDiscounted(response.data)
        setSuccessButton("Applied")

        setDiscountedObj({fee: response.data.fixed_cut, percent: response.data.percent_cut, id: response.data.id, wholy: response.data.wholy})

        const percentAdjustment = price*response.data.percent_cut;

        if (response.data.wholy == "true") {
          if ((percentAdjustment - response.data.fixed_cut) <= 0) {
            setPrice(0)
          } else {
            setPrice(percentAdjustment - response.data.fixed_cut)
          }
        } else {
          if ((parseFloat(price) - percentAdjustment - response.data.fixed_cut) <= 0) {
            setPrice(0)
          } else {
            setPrice(parseFloat(price) - percentAdjustment - response.data.fixed_cut)
          }
        }



      } else {
        setSuccessButton("Not Found")
      }
    } catch (err) {
      setSuccessButton("Not Found")
      setTimeout(() => {
        setSuccessButton("Apply")
      }, 1500)
      setDiscounted()
    }
  }

  const adjustBalance = async () => {

      let url = "http://localhost:8080/mybalances/topup"
      let p = Cookies.get('access_token')

      const config = {
        headers: {Authorization: `Bearer ${p}`},
      };

      try {
        // let pricex = parseInt(price*-1)


        const response = await axios.post(
            url,
            {
              "added_balance": parseFloat(price*(-1.0))
            },
            config,
        )


      } catch (err) {
        // setBalance("Error Adding Your Balance")
      }

  }

  const buyProduct = async (value) => {
    let url = "http://localhost:8080/transacts"
    let p = Cookies.get('access_token')

    const config = {
      headers: {Authorization: `Bearer ${p}`},
    };

    try {
      const response = await axios.post(
          url,
          value,
          config
      );

      let buyProd = response.data;
      // console.log(buyProd);

    } catch (err) {
      // setBalance("Please Activate the Balance Services")
    }
  }




  const showSuccess = () => {
    const value = {
      "author_id": user.currentUser.id,
      "product_id": props.product.id,
      "qty": props.qty,
      "disc_name": discountname
    }



    buyProduct(value)
    adjustBalance()


    setSuccess(true)
  }

  const clickApply = async () => {
    await fetchDiscount()
  }

  const handleChange = (event) => {
    setDiscountName(event.target.value.toUpperCase());
  }

  React.useEffect(() => {
    fetchBalance();
  }, [balance])



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
                {balance && balance !== "Please Activate the Balance Services" && <Typography color="textPrimary" variant="subtitle1" component="h1">
                  {/*Saldo Anda : {balance ? balance : "Activate Your Balance Services"}*/}
                  Saldo Anda : {balance ? "Rp. " + parseFloat(balance.replace("Rp. ", "")).toLocaleString() : "Activate Your Balance Services"}
                </Typography>}

                {balance && balance == "Please Activate the Balance Services" && <Typography color="textPrimary" variant="subtitle1" component="h1">
                  {/*Saldo Anda : {balance ? balance : "Activate Your Balance Services"}*/}
                  Saldo Anda : Activate Your Balance Services
                </Typography>}
              </div>

              <div style={{marginBottom: "20px"}}>
                <Typography color="textPrimary" variant="subtitle1" component="h1">
                  (Harga /unit: Rp. {props.price.toLocaleString()})
                </Typography>
              </div>


              <div style={{marginBottom: "-10px"}}>
                <Typography color="textPrimary" variant="subtitle1" component="h1">
                  Harga Total: Rp. {(price).toLocaleString()}, Dengan Qty: {props.qty}
                </Typography>
              </div>

              <Grid container={true}>
                <TextField
                    size="small"
                    style={{width: "55%"}}
                    label="Discount Code"
                    name="discountcode"
                    placeholder="Your Discount Code"
                    defaultValue={""}
                    margin="normal"
                    onChange={handleChange}
                    value={discountname}
                    disabled={successButton.toLowerCase() == "applied"}
                    // onChange={handleChange("quantity")}
                    // fullWidth
                    // error={filedError.quantity !== ""}
                    // helperText={
                    //     filedError.quantity !== "" ? `${filedError.quantity}` : ""
                    // }
                    // required
                />
                <Button size="small" disabled={successButton.toLowerCase() == "applied"} onClick={() => clickApply()} variant="contained" style={{marginLeft: "20px", height: "30%", marginTop: "35px"}}>
                  {successButton}
                </Button>
              </Grid>
              Percentage Cut: {discountedObj.percent*100}%, Fixed Cut: Rp. {discountedObj.fee} {discountedObj.wholy === "true" ? ", Whole Opts: Yes" : ""}


              <div style={{marginLeft: "90px"}}>
                {balance !== "Please Activate the Balance Services" &&
                <Button
                    disabled={balance && parseFloat(balance.replace("Rp. ", "")) < price}
                    onClick={() => showSuccess()} size="medium" style={{height: "40%", marginTop: "55px"}}>
                  Confirm
                  <div style={{opacity: 0}}>{"x"}</div>
                  <Check/>
                </Button>}

                {/*{balance === "Please Activate the Balance Services" &&*/}
                {/*<Button*/}
                {/*    disabled*/}
                {/*    onClick={() => showSuccess()} size="medium" style={{height: "40%", marginTop: "55px"}}>*/}
                {/*  Confirm*/}
                {/*  <div style={{opacity: 0}}>{"x"}</div>*/}
                {/*  <Check/>*/}
                {/*</Button>}*/}
              </div>
            </div>)}
      </>
  );
};
