import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

// Destructure props
const FirstStep = ({
  handleNext,
  handleChange,
  values: { title, description, image, tag },
  filedError,
  isError,
}) => {
  // Check if all values are not empty
  const isEmpty =
    title.length > 0 &&
    title.length > 35 &&
    title.length < 71 &&
    description.length >= 24 &&
    description.length <= 36 &&
    tag.length > 0 &&
    image.length > 0 &&
    // image.length > 0;
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
          <FormControl fullWidth required margin="normal">
            <InputLabel htmlFor="tag">Tag</InputLabel>
            <Select value={tag} onChange={handleChange("tag")}>
              <MenuItem value={"Quirk"}>Quirk</MenuItem>
              <MenuItem value={"Cool"}>Cool</MenuItem>
              <MenuItem value={"Informative"}>Informative</MenuItem>
              <MenuItem value={"Tech"}>Tech</MenuItem>
              <MenuItem value={"Rnb"}>Rnb</MenuItem>
              <MenuItem value={"Soul"}>Soul</MenuItem>
              <MenuItem value={"Pop"}>Pop</MenuItem>
              <MenuItem value={"Study-tips"}>Study-Tips</MenuItem>
            </Select>
          </FormControl>
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
