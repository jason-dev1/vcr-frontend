import React from "react";
import { StyleSheet } from "react-native";

import Label from "../Label";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return <Label textStyle={styles.error}>{error}</Label>;
}

const styles = StyleSheet.create({
  error: { color: "red", fontSize: 14 },
});

export default ErrorMessage;
