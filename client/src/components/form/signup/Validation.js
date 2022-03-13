import React, { useState, Fragment } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import SignUpField from "./SignUpField";

const emailRegex = RegExp(/^[^@]+@[^@]+\.[^@]+$/);
const phoneRegex = RegExp(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/);
// Step titles
const labels = ["Login"];

const StepForm = (props) => {
  const [steps, setSteps] = useState(0);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  // Copy fields as they all have the same name
  const [filedError, setFieldError] = useState({
    ...fields,
  });

  const [isError, setIsError] = useState(false);

  // Proceed to next step
  const handleNext = () => setSteps(steps);
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
    const passwordValidate = value.length > 6;

    switch (input) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "password":
        // formErrors.email = emailRegex.test(value)
        formErrors.password = passwordValidate
          ? ""
          : "Minimum password allowed is 6 characters";
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
          <SignUpField
            handleNext={handleNext}
            handleChange={handleChange}
            values={fields}
            isError={isError}
            filedError={filedError}
            closeAll={props.closeAll}
          />
        );
      // case 1:
      //   return (
      //     <SecondStep
      //       handleNext={handleNext}
      //       handleBack={handleBack}
      //       handleChange={handleChange}
      //       values={fields}
      //       isError={isError}
      //       filedError={filedError}
      //     />
      //   );
      // case 1:
      //   return (
      //     <Confirm
      //       handleNext={handleNext}
      //       handleBack={handleBack}
      //       values={fields}
      //     />
      //   );
      default:
        break;
    }
  };

  // Handle components
  return (
    <>
      <div>
        <Fragment>
          {/* <Stepper
            activeStep={steps}
            style={{ paddingTop: 30, paddingBottom: 50 }}
            alternativeLabel
          >
            {labels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper> */}
          {handleSteps(steps)}
        </Fragment>
      </div>
    </>
  );
};

export default StepForm;
