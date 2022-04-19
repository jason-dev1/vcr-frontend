import React, { useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import { ListItem, Overlay } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppListItemSeperator from "./ListItemSeperator";
import Label from "./Label";
import Text from "./Text";

import defaultStyles from "../config/styles";

function AppList({
  containerStyle,
  emptyPlaceholder = "Empty result",
  icon,
  iconColor,
  items,
  itemKeyField = "id",
  itemNameField = "name",
  onSelectItem,
  placeholder,
  selectedItem,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    setModalVisible(false);
    onSelectItem(item);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, containerStyle]}>
          <Label
            icon={icon}
            iconColor={iconColor}
            textColor={
              selectedItem
                ? defaultStyles.colors.dark
                : defaultStyles.colors.medium
            }
          >
            {selectedItem ? selectedItem[itemNameField] : placeholder}
          </Label>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={defaultStyles.colors.medium}
            style={styles.chevron}
          />
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
        {items.length < 1 && (
          <Text style={styles.emptyPlaceholderText}>{emptyPlaceholder}</Text>
        )}
        <FlatList
          data={items}
          keyExtractor={(item) => item[itemKeyField]}
          ItemSeparatorComponent={AppListItemSeperator}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => handleSelect(item)}
              underlayColor={defaultStyles.colors.medium}
            >
              <ListItem containerStyle={styles.listItem}>
                <ListItem.Content>
                  <ListItem.Title
                    style={[defaultStyles.text, styles.listItemTitle]}
                  >
                    {item[itemNameField]}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableHighlight>
          )}
        />
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
    marginVertical: 5,
    padding: 15,
    width: "100%",
  },
  emptyPlaceholderText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    marginVertical: 10,
    fontSize: 18,
    color: defaultStyles.colors.medium,
  },
  listItem: { padding: 10 },
  listItemTitle: {
    fontSize: 18,
  },
  overlay: {
    borderRadius: 25,
    justifyContent: "center",
    marginVertical: 80,
    padding: 10,
    width: "95%",
  },
  overlayTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    padding: 10,
    paddingHorizontal: 20,
  },
});

export default AppList;
