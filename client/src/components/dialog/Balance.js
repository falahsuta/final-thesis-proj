import React, {useState} from "react";

import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Check} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";

export default (props) => {
    const markProps = "markprops";


    const [topup, setTopup] = useState();

    const handleChange = (event) => {
        let x = (parseInt(event.target.value))

        setTopup((x));
    }

    const spacing = (num) => {
        return <div style={{marginTop: "3px", width: "30px", height: num}}></div>;
    };

    // console.log(items);

    return (
        <>
            <div style={{margin: "70px", marginTop: "60px"}}>
                {/*<Grid container direction="row" justify="center" alignItems="center" >*/}
                <div style={{marginBottom: "30px"}}>
                    <Typography color="textPrimary" variant="h4" component="h2">
                        {"Your Balance".toUpperCase()}
                    </Typography>
                </div>


                <div style={{marginBottom: "20px"}}>
                    <Typography color="textPrimary" variant="subtitle1" component="h1">
                        Saldo Anda : Rp. 30.000.000
                    </Typography>
                </div>


                <Grid container={true}>
                    <CurrencyTextField
                        label="Price"
                        name="price"
                        placeholder=""
                        defaultValue={topup}
                        onChange={handleChange}
                        currencySymbol="Rp"
                        margin="normal"
                        required
                    />
                    <Button size="small" variant="contained"
                            style={{marginLeft: "20px", height: "30%", marginTop: "35px"}}>Add</Button>
                </Grid>
                Topup untuk menambah saldo

            </div>
        </>
    );
};
