import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import {ShoppingCart} from '@material-ui/icons';

// import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

class GroupedButtons extends React.Component {
  state = { counter: 1 };

  handleIncrement = () => {
    this.setState(state => ({ counter: state.counter + 1 }));
  };

  handleDecrement = () => {
    this.setState(state => ({ counter: state.counter - 1 }));
  };

  price = 14000

  render() {
    const displayCounter = this.state.counter > 0;

    return (
        <>
        <ButtonGroup size="small" aria-label="small outlined button group" style={{marginBottom: "20px", marginTop: "15px"}}>
          <Button onClick={this.handleIncrement}>+</Button>
          {displayCounter && <Button onClick={this.handleDecrement}>-</Button>}
          {displayCounter && <Button disabled style={{textTransform: 'none', color: "white"}}><>
          <div style={{opacity: 0}}>{"xx"}</div>Qty: {this.state.counter}, Total Price: Rp. {(this.price*this.state.counter).toLocaleString()}
            <div style={{opacity: 0}}>{"xx"}</div>
          </>
          </Button>}
          {displayCounter && <Button>Buy <ShoppingCart style={{marginLeft: "8px", color: "#D4D4D4"}} /></Button>}
        </ButtonGroup>
        </>
    );
  }
}

export default GroupedButtons;
