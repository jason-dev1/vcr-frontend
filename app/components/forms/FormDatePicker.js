import React, { useEffect } from "react";
import { useFormikContext } from "formik";

import DatePicker from "../DatePicker";
import ErrorMessage from "./ErrorMessage";

function AppFormDatePicker({ date, icon, name, placeholder, width }) {
  const { errors, setFieldTouched, setFieldValue, touched, values } =
    useFormikContext();

  useEffect(() => {
    if (date) {
      setFieldTouched(name);
      setFieldValue(name, date);
    }
  }, [date]);

  return (
    <>
      <DatePicker
        icon={icon}
        onSelectDate={(date) => {
          setFieldTouched(name);
          setFieldValue(name, date);
        }}
        placeholder={placeholder}
        selectedDate={touched[name] ? values[name] : date}
        width={width}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormDatePicker;
