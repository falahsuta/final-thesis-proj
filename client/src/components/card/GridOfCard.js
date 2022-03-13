import React from "react";
import Divider from "@material-ui/core/Divider";

import HorizontalCard from "./HorizontalCard";

export default (props) => {
  const datalength = props.customData.length - 1;
  const renderMiddle = props.customData.map((element, index) => {
    return (
      <>
        <HorizontalCard
          id={element._id}
          title={element.title}
          imglink={element.image}
          tag={element.tag}
          name={element.username}
          markProps={props.markProps}
        />
        <Divider
          light
          style={{
            margin: "13px 0",
            // height: index === 0 ? "0.6px" : "1px",
            width: props.markProps ? "385px" : "355px",
            display: index === datalength ? "none" : undefined,
          }}
        />
      </>
    );
  });

  return <>{renderMiddle}</>;
};
