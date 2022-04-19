import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";

import defaultStyles from "../config/styles";
import Text from "./Text";

function Label({
  children,
  containerStyle,
  icon,
  iconColor = defaultStyles.colors.medium,
  onPress,
  overflowAnimated = false,
  textColor = defaultStyles.colors.medium,
  textStyle,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      disabled={onPress ? false : true}
    >
      {icon && (
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      )}

      {!overflowAnimated && (
        <Text
          style={[
            defaultStyles.text,
            styles.text,
            { color: textColor },
            textStyle,
          ]}
          {...otherProps}
        >
          {children}
        </Text>
      )}

      {overflowAnimated && (
        <TextTicker
          style={[
            defaultStyles.text,
            styles.text,
            { color: textColor },
            textStyle,
          ]}
          animationType="scroll"
          bouncePadding={{ left: 0 }}
          duration={10000}
          scroll={false}
          scrollSpeed={2000}
          repeatSpacer={0}
          {...otherProps}
        >
          {children}
        </TextTicker>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  text: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Label;
