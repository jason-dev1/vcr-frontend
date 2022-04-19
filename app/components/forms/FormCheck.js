import React from "react";
import { View, StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import CheckBox from "expo-checkbox";

import ErrorMessage from "./ErrorMessage";
import Text from "../Text";

import defaultStyles from "../../config/styles";

function AppFormCheck({ children, name, width, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <View style={styles.container}>
        <CheckBox
          color={
            values[name]
              ? defaultStyles.colors.primary
              : defaultStyles.colors.medium
          }
          style={styles.checkbox}
          value={values[name]}
          onValueChange={(isChecked) => setFieldValue(name, isChecked)}
        />
        <Text style={styles.text}>{children}</Text>
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignSelf: "center",
    margin: 10,
  },
  container: { flex: 1, flexDirection: "row" },
  text: {
    flex: 1,
    alignSelf: "center",
    color: defaultStyles.colors.medium,
    fontSize: 14,
  },
});

export default AppFormCheck;
