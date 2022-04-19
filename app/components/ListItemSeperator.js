import React from "react";
import { StyleSheet, View } from "react-native";

import defaultStyles from "../config/styles";

function AppListItemSeperator({
  backgroundColor = defaultStyles.colors.light,
  height = 2,
}) {
  return <View style={[styles.separator, { backgroundColor, height }]} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
  },
});

export default AppListItemSeperator;
