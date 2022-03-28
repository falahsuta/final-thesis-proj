import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";

// Destructure props
const FirstStep = ({
  handleNext,
  handleChange,
  values: { title, description, image, tag, price, quantity },
  filedError,
  isError,
}) => {
  const tags = useSelector((state) => state.tag);

  // Check if all values are not empty
  const isEmpty =
    title.length > 0 &&
    title.length >= 6 &&
    title.length <= 16 &&
    description.length >= 6 &&
    description.length <= 16 &&
    tag.length > 0 &&
    parseInt(quantity) > 0 &&
    parseInt(quantity) < 36 &&
    image.length > 0 &&
    image.length >= 12;

  return (
    <Fragment>
      <Grid container spacing={2} noValidate>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            placeholder="Your Title"
            defaultValue={title}
            onChange={handleChange("title")}
            margin="normal"
            error={filedError.title !== ""}
            helperText={filedError.title !== "" ? `${filedError.title}` : ""}
            required
          />

          {/* <TextField
              fullWidth
              label="Title"
              name="title"
              placeholder="Your Title"
              defaultValue={title}
              onChange={handleChange("title")}
              margin="normal"
              error={filedError.title !== ""}
              helperText={filedError.title !== "" ? `${filedError.title}` : ""}
              required
            /> */}
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            placeholder="Your Description"
            defaultValue={description}
            onChange={handleChange("description")}
            margin="normal"
            error={filedError.description !== ""}
            helperText={
              filedError.description !== "" ? `${filedError.description}` : ""
            }
            required
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <CurrencyTextField
              fullWidth
              label="Price"
              name="price"
              placeholder=""
              defaultValue={price}
              onChange={handleChange("price")}
              currencySymbol="Rp"
              margin="normal"
              error={filedError.price !== ""}
              helperText={
                filedError.price !== "" ? `${filedError.price}` : ""
              }
              required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
              fullWidth
              type="number"
              min="0"
              label="Quantity"
              name="quantity"
              placeholder="Your Quantity"
              defaultValue={description}
              onChange={handleChange("quantity")}
              margin="normal"
              error={filedError.quantity !== ""}
              helperText={
                filedError.quantity !== "" ? `${filedError.quantity}` : ""
              }
              required
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Image"
            name="image"
            placeholder="Your Image Link"
            // type="image"
            defaultValue={image}
            onChange={handleChange("image")}
            margin="normal"
            error={filedError.image !== ""}
            helperText={filedError.image !== "" ? `${filedError.image}` : ""}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          {tags && tags.length > 0 && (
              <FormControl fullWidth required margin="normal">
                <InputLabel htmlFor="tag">Tag</InputLabel>
                <Select value={tag} onChange={handleChange("tag")}>
                  {tags.map(e => {
                    return (
                        <MenuItem value={e.name}>{e.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
          )}
        </Grid>

      </Grid>
      <div
        style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          disabled={!isEmpty || isError}
          color="primary"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </Fragment>
  );
};

export default FirstStep;
