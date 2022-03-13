import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default (props) => {
  return (
    <>
      <Button
        // onClick={() => console.log("Clicked")}
        // disableRipple
        onClick={() => props.action()}
        color="textSecondary"
        style={{
          borderRadius: "17px",
          width: props.widthSpec ? `${props.widthSpec}px` : "80px",
          textTransform: "none",
          // marginTop: "-2px",
          marginBottom: "10px",
          marginRight: "5px",
          height: props.heightSpec ? `${props.heightSpec}px` : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "3px",
          }}
        >
          {props.children}
          <Typography
            mt={2}
            variant="body2"
            color="textSecondary"
            component="p"
          >
            <div style={{ marginTop: "1px", marginLeft: "3px" }}>
              {props.buttonText}
            </div>
          </Typography>
        </div>
      </Button>
    </>
  );
};
