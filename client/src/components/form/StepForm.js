import React, { useState, Fragment } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import Confirm from "./Confirm";
import Success from "./Success";

// const emailRegex = RegExp(/^[^@]+@[^@]+\.[^@]+$/);
const phoneRegex = RegExp(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/);
// Step titles
const labels = ["Thumbnail", "Content", "Confirmation"];

const StepForm = (props) => {
  const [steps, setSteps] = useState(0);
  const [fields, setFields] = useState({
    title: "",
    description: "",
    image: "",
    tag: "",
    content: "",
  });
  // Copy fields as they all have the same name
  const [filedError, setFieldError] = useState({
    ...fields,
  });

  const [isError, setIsError] = useState(false);

  // Proceed to next step
  const handleNext = () => setSteps(steps + 1);
  // Go back to prev step
  const handleBack = () => setSteps(steps - 1);

  // Handle fields change
  const handleChange = (input) => ({ target: { value } }) => {
    // Set values to the fields
    setFields({
      ...fields,
      [input]: value,
    });

    // Handle errors
    const formErrors = { ...filedError };
    const lengthValidate = value.length > 0 && value.length < 3;
    const contentValidate = value.length < 100;
    const titleValidate = value.length < 36 || value.length > 70;
    const descValidate = value.length < 24 || value.length > 36;
    const imageLinkValidate = value.length >= 12;

    // console.log("form errors");
    // console.log(formErrors);

    switch (input) {
      case "title":
        formErrors.title = titleValidate
          ? "Minimum 36 characters and Maximum of 60 characters"
          : "";
        break;
      case "description":
        formErrors.description = descValidate
          ? "Minimum 24 characters and Maximum of 36 characters"
          : "";
        break;
      case "image":
        // formErrors.email = emailRegex.test(value)
        formErrors.image = imageLinkValidate
          ? ""
          : "Invalid Link Detected, Link has to required minimum of 12 characters";
        break;
      case "content":
        formErrors.content = contentValidate
          ? "Content at least contain 400 characters long"
          : "";
        break;
      default:
        break;
    }

    // set error hook
    Object.values(formErrors).forEach((error) =>
      error.length > 0 ? setIsError(true) : setIsError(false)
    );

    // set errors hook
    setFieldError({
      ...formErrors,
    });
  };

  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <FirstStep
            handleNext={handleNext}
            handleChange={handleChange}
            values={fields}
            isError={isError}
            filedError={filedError}
          />
        );
      case 1:
        return (
          <SecondStep
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={fields}
            isError={isError}
            filedError={filedError}
          />
        );
      case 2:
        return (
          <Confirm
            handleNext={handleNext}
            handleBack={handleBack}
            values={fields}
          />
        );
      default:
        break;
    }
  };

  // Handle components
  return (
    <div>
      {steps === labels.length ? (
        <Success closeAll={props.closeAll} />
      ) : (
        <Fragment>
          <Stepper
            activeStep={steps}
            style={{ paddingTop: 30, paddingBottom: 50 }}
            alternativeLabel
          >
            {labels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {handleSteps(steps)}
        </Fragment>
      )}
    </div>
  );
};

export default StepForm;
