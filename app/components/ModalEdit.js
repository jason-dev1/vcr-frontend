import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Overlay } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Label from "./Label";
import AppListItemSeperator from "./ListItemSeperator";
import Text from "./Text";

import defaultStyles from "../config/styles";

function ModalEdit({
  children,
  editable,
  icon,
  placeholder,
  secureTextEntry,
  value,
  width = "100%",
  modalVisible = false,
  setModalVisible,
}) {
  if (secureTextEntry) value = "••••••••";

  return (
    <>
      <TouchableWithoutFeedback
        disabled={!editable}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.container, { width }]}>
          <Label
            icon={icon}
            textColor={
              value ? defaultStyles.colors.dark : defaultStyles.colors.medium
            }
          >
            {value ? value : placeholder}
          </Label>
          {editable && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={defaultStyles.colors.medium}
              style={styles.chevron}
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      <Overlay
        animationType="fade"
        isVisible={modalVisible}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Text style={styles.overlayTitle}>{placeholder}</Text>
        <AppListItemSeperator
          backgroundColor={defaultStyles.colors.black}
          height={1}
        />
        {children}
      </Overlay>
    </>
  );
}

const styles = StyleSheet.create({
  chevron: {
    alignSelf: "center",
    right: 15,
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 12,
    flexDirection: "row",
    marginVertical: 10,
    padding: 15,
  },
  overlay: {
    borderRadius: 25,
    width: "95%",
    justifyContent: "center",
    padding: 10,
  },
  overlayTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    padding: 10,
    paddingHorizontal: 20,
  },
});

export default ModalEdit;
