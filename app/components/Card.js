import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import defaultStyles from "../config/styles";

function Card({ children, onPress, style }) {
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={onPress ? false : true}
    >
      <View style={[styles.card, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.medium,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 20,
    shadowColor: defaultStyles.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    elevation: 4,
  },
});

export default Card;
