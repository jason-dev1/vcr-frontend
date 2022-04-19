import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

const AppTextInput = React.forwardRef(
  ({ containerStyle, icon, ...otherProps }, ref) => {
    return (
      <View ref={ref} style={[styles.container, containerStyle]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={defaultStyles.colors.medium}
            style={[styles.icon]}
          />
        )}
        <TextInput
          disabled
          placeholderTextColor={defaultStyles.colors.medium}
          style={[styles.textInput, defaultStyles.text]}
          {...otherProps}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 12,
    flexDirection: "row",
    marginVertical: 5,
    padding: 15,
    width: "100%",
  },
  icon: {
    alignSelf: "center",
  },
  textInput: {
    marginLeft: 10,
    width: "90%",
  },
});

export default AppTextInput;
