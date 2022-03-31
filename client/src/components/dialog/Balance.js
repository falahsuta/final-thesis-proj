import React, {useState} from "react";

import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import Cookies from "js-cookie";
import axios from "axios";

export default (props) => {
    const markProps = "markprops";

    const [topup, setTopup] = useState();
    const [balance, setBalance] = useState("Loading ...");

    const handleChange = (event) => {
        let x = (parseInt(event.target.value))

        setTopup((x));
    }

    const spacing = (num) => {
        return <div style={{marginTop: "3px", width: "30px", height: num}}></div>;
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

            console.log(response.data)

            setBalance(response.data["current_balance"].toLocaleString())

        } catch (err) {
            setBalance("Please Activate the Balance Services")
        }
    }

    const fetchActivate = async () => {
        let url = "http://localhost:8080/mybalances/activate"
        let p = Cookies.get('access_token')

        const config = {
            headers: {Authorization: `Bearer ${p}`},
        };

        try {
            const response = await axios.post(
                url,
                {},
                config,
            )

        } catch (err) {
            setBalance("Error Activating")
        }
    }

    const fetchAddBalance = async () => {
        let url = "http://localhost:8080/mybalances/topup"
        let p = Cookies.get('access_token')

        const config = {
            headers: {Authorization: `Bearer ${p}`},
        };

        try {
            setTopup(0)

            const response = await axios.post(
                url,
                {
                    "added_balance": parseFloat(topup)
                },
                config,
            )


        } catch (err) {
            setBalance("Error Adding Your Balance")
        }
    }


    const activate = async () => {
        await fetchActivate()
        setBalance("Loading ...")
    }

    const addBalance = async () => {
        await fetchAddBalance()
        setBalance("Loading ...")
    }


    React.useEffect(() => {
        setTimeout(() => {
            fetchBalance();
        }, 400)

    }, [balance])


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
                        Saldo Anda : {balance}
                        {balance === "Please Activate the Balance Services" && (
                            <>
                                <Button size="small" variant="contained"
                                        style={{marginLeft: "15px", marginTop: "0"}} onClick={() => activate()}>Activate
                                </Button>
                            </>
                        )}
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
                            onClick={() => addBalance()}
                            style={{marginLeft: "20px", height: "30%", marginTop: "35px"}}>Add
                    </Button>
                </Grid>
                Topup untuk menambah saldo

            </div>
        </>
    );
};
