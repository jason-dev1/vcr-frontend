import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

function AppButton({
  icon,
  onPress,
  style,
  title,
  color = "primary",
  disabled = false,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: defaultStyles.colors[color] },
        !disabled ? null : styles.buttonDisabled,
        style,
      ]}
      {...otherProps}
    >
      {title ? <Text style={styles.text}>{title}</Text> : null}
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  text: {
    color: defaultStyles.colors.white,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
});

export default AppButton;
