import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import {ShoppingCart} from '@material-ui/icons';
import Fade from "@material-ui/core/Fade";
import PostShow from "./PostShow";
import Dialog from "@material-ui/core/Dialog";
import {closePost, fetchPost} from "../../actions";

import Success from './Success';

import Buy from "./Buy";

// import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export default (props) => {
  const [counter, setCounter] = React.useState(1);
  const [open, setOpen] = React.useState(false);

  const [success, setSuccess] = React.useState(false);

  const handleIncrement = () => {
    if (counter < totalQty) {
      setCounter((e) => e+1)
    }
  };

  const handleDecrement = () => {
    setCounter((e) => e-1)
  };

  const handleOpen = () => {
    // dispatch(fetchPost(props.id));
    setOpen(true);
  };

   const handleClose = () => {
    // dispatch(closePost());
    setOpen(false);
  };

  const handleClose2 = () => {
    // dispatch(closePost());
    setOpen(false);
    setSuccess(true);
  };

  const price = 14000
  const totalQty = 13

    return (
        <>
        <ButtonGroup size="small" aria-label="small outlined button group" style={{marginBottom: "20px", marginTop: "15px"}}>
          <Button onClick={handleIncrement}>+</Button>
          {counter > 0 && <Button onClick={handleDecrement}>-</Button>}
          {counter > 0 &&
            <Button disabled style={{textTransform: 'none', color: "white"}}>
              <>
                <div style={{opacity: 0}}>{"xx"}</div>
                Total Qty: {totalQty}, Qty: {counter}, Total Price: Rp. {(price*counter).toLocaleString()}
                <div style={{opacity: 0}}>{"xx"}</div>
              </>
            </Button>
          }
          {counter > 0 && <Button onClick={handleOpen}>Buy <ShoppingCart style={{marginLeft: "8px", color: "#D4D4D4"}} /></Button>}
        </ButtonGroup>
          <Dialog
              maxWidth
              onClose={handleClose}
              aria-labelledby="simple-dialog-title"
              open={open}
              scroll="body"
          >
            <Fade in={open}>
              <Buy after={handleClose2} totalQty={totalQty} qty={counter} price={price} />
            </Fade>
          </Dialog>
        </>


    );

}

