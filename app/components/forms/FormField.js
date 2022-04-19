import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import TextInput from "../TextInput";

function AppFormField({ onEndEditing = () => {}, name, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  const handleChangeText = (text) => {
    setFieldValue(name, text);
  };

  const handleEndEditingValidated = async ({ nativeEvent }) => {
    if (!errors[name]) onEndEditing(nativeEvent.text);
  };

  return (
    <>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChangeText}
        onEndEditing={handleEndEditingValidated}
        value={values[name]}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
