import React, { Fragment, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

const Success = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }, []);

  return (
    <Fragment>
      {/* <Typography variant="h2" align="center">
				Thank 
			</Typography> */}
      <Typography component="p" align="center">
        Your request has been successfully processed. Timeline has been Updated.
      </Typography>
    </Fragment>
  );
};

export default Success;

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
