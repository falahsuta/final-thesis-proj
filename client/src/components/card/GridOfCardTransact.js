import React from "react";
import Divider from "@material-ui/core/Divider";

import HorizontalCardTransacts from "./HorizontalCardTransacts";
import HorizontaDiscCard from "./HorizontalDiscCard";
import {useSelector} from "react-redux";

export default (props) => {
  const datalength = props.customData.length - 1;
  const user = useSelector((state) => state.user);

  const renderMiddle = props.customData.map((element, index) => {
    return (
      <>
          {!props.discount && <HorizontalCardTransacts
              id={element.id}
              data={element}
              user={user}
              // title={element.title}
              // imglink={element.images[0]}
              // tag={element.tag}
              // name={element.author.nickname}
              // price={element.price}
              // quantity={element.quantity}
              // markProps={props.markProps}
              // discount={props.discount}
          />}

          {props.discount && <HorizontaDiscCard
              id={element._id}
              title={element.name}
              tag={element.tag}
              el={element}
              markProps={props.markProps}
              discount={props.discount}
          />}
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
