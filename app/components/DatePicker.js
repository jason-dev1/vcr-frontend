import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import DatePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import Label from "./Label";

import defaultStyles from "../config/styles";

function AppDatePicker({
  icon,
  onSelectDate,
  placeholder,
  selectedDate,
  width = "100%",
  ...otherProps
}) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const onChange = (event, newDate) => {
    setPickerVisible(false);

    if (!newDate) return;

    onSelectDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setPickerVisible(true)}>
        <View style={[styles.container, { width }]}>
          <Label
            icon={icon}
            textColor={
              selectedDate
                ? defaultStyles.colors.dark
                : defaultStyles.colors.medium
            }
          >
            {selectedDate ? selectedDate : placeholder}
          </Label>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={defaultStyles.colors.medium}
            style={styles.chevron}
          />
        </View>
      </TouchableWithoutFeedback>

      {pickerVisible && (
        <DatePicker
          mode="date"
          onChange={onChange}
          testID="dateTimePicker"
          value={selectedDate ? new Date(selectedDate) : new Date("2000-01-01")}
          {...otherProps}
        />
      )}
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
  },
});

export default AppDatePicker;
