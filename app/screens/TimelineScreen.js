import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import Card from "../components/Card";
import Label from "../components/Label";
import Screen from "../components/Screen";
import Text from "../components/Text";

import appointmentsApi from "../api/appointments";
import defaultStyles from "../config/styles";
import NavigationContext from "../navigation/context";
import recordsApi from "../api/records";
import useApi from "../hooks/useApi";

import CONSTANTS from "../config/constants";

const FILTER = ["Show All", "Only Vaccination", "Only Appointment"];

const TimelineScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const getAppointmentsApi = useApi(appointmentsApi.getAppointments);
  const getRecordsApi = useApi(recordsApi.getRecords);

  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [filterIndex, setFilterIndex] = React.useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [toRefresh, setToRefresh] = useState(false);
  const [records, setRecords] = useState([]);

  const { navigationRefresh, setNavigationRefresh } =
    useContext(NavigationContext);

  const initializeAppointments = async () => {
    const result = await getAppointmentsApi.request();

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve appointment details.");

      return;
    }

    const appointments = result.data;

    let timelineArr = [];
    for (let appointment of appointments) {
      const timelineDatetime = dayjs(appointment.last_updated_datetime);
      const appointmentDatetime = dayjs(appointment.timeslot.datetime);

      let status_color = defaultStyles.colors.medium;
      switch (appointment.appointment_status) {
        case -3:
        case -2:
        case -1:
          status_color = defaultStyles.colors.danger;
          break;
        case 1:
          status_color = defaultStyles.colors.cyanBlue;
          break;
        case 2:
          status_color = defaultStyles.colors.vineGreen;
          break;
        case 3:
          status_color = defaultStyles.colors.primary;
          break;
      }

      const timeline = {
        appointmentDatetime: `${appointmentDatetime.format(
          "DD.MM.YYYY"
        )} ${appointmentDatetime.format("HH:mm")}`,
        color: status_color,
        date: timelineDatetime.format("DD.MM.YYYY"),
        datetime: timelineDatetime.toDate(),
        id: `APPOINTMENT_${appointment.id}`,
        location: appointment.timeslot.center.name,
        subtitle: `${
          CONSTANTS.DOSE_TYPE[appointment.dose_type]
        } Dose Appointment`,
        time: timelineDatetime.format("HH:mm"),
        title: `Appointment ${
          CONSTANTS.APPOINTMENT_STATUS[appointment.appointment_status]
        }`,
        type: "Only Appointment",
      };
      timelineArr.push(timeline);
    }
    setAppointments(timelineArr);
  };

  const initializeRecords = async () => {
    const result = await getRecordsApi.request();

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve vaccination details.");

      return;
    }

    const records = result.data;

    let timelineArr = [];
    for (let record of records) {
      const timelineDatetime = dayjs(record.dose_receive_datetime);

      const timeline = {
        brand: CONSTANTS.VACCINE_BRAND[record.vaccine_brand],
        color: defaultStyles.colors.vineGreen,
        date: timelineDatetime.format("DD.MM.YYYY"),
        datetime: timelineDatetime.toDate(),
        id: `RECORD_${record.id}`,
        location: record.appointment.timeslot.center.name,
        subtitle: `${
          CONSTANTS.DOSE_TYPE[record.appointment.dose_type]
        } Dose Completed`,
        time: timelineDatetime.format("HH:mm"),
        title: `${
          CONSTANTS.DOSE_TYPE[record.appointment.dose_type]
        } Dose Received`,
        type: "Only Vaccination",
      };
      timelineArr.push(timeline);
    }

    setRecords(timelineArr);
  };

  const initializeData = async () => {
    await Promise.all([initializeAppointments(), initializeRecords()]);
  };

  const sortEvents = (events) => {
    const sortedEvents = events.sort((a, b) => b.datetime - a.datetime);
    return sortedEvents;
  };

  const handleFilter = async () => {
    const events = appointments.concat(records);

    if (events.length < 1) return;

    const filterID = filterIndex + 1;
    setFilterIndex(filterID);

    const field = FILTER[filterID % FILTER.length];

    let filteredEvents = [];

    if (field !== "Show All")
      filteredEvents = events.filter((event) => {
        return event.type === field;
      });
    else filteredEvents = events;

    setEvents(sortEvents(filteredEvents));
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    isFocused ? initializeData() : setToRefresh(true);
  }, [navigationRefresh]);

  useEffect(() => {
    setEvents(sortEvents(appointments.concat(records)));
  }, [records, appointments]);

  useFocusEffect(
    React.useCallback(() => {
      if (!toRefresh) return;

      setToRefresh(false);
      handleRefresh();
    }, [toRefresh])
  );

  return (
    <Screen
      style={styles.screen}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <Label
        onPress={handleFilter}
        icon="filter"
        containerStyle={{ flexDirection: "row-reverse", width: "auto" }}
      >
        {FILTER[filterIndex % FILTER.length]}
      </Label>

      <View style={styles.row}>
        <Text style={styles.headerTime}>Time</Text>
        <Text style={styles.headerEvent}>Event</Text>
      </View>

      {events.length <= 0 && (
        <View style={styles.row}>
          <View style={styles.dateTime}>
            <Text style={styles.date}>--/--</Text>
            <Text style={styles.time}>--:--</Text>
          </View>

          <Card
            style={[
              styles.card,
              { backgroundColor: defaultStyles.colors.normal },
            ]}
          >
            <Text style={styles.cardTitle}>No timeline events</Text>
          </Card>
        </View>
      )}

      {events.map((timeline) => {
        return (
          <View key={timeline.id} style={styles.row}>
            <View style={styles.dateTime}>
              <Text style={styles.date}>{timeline.date}</Text>
              <Text style={styles.time}>{timeline.time}</Text>
            </View>

            <Card style={[styles.card, { backgroundColor: timeline.color }]}>
              <Text style={styles.cardTitle}>{timeline.title}</Text>
              <Text style={styles.cardSubtitle}>{timeline.subtitle}</Text>

              <Label
                icon="map-marker-outline"
                iconColor={defaultStyles.colors.white}
                style={styles.cardLabel}
              >
                {timeline.location}
              </Label>

              {timeline.appointmentDatetime && (
                <Label
                  icon="clock-time-eight-outline"
                  iconColor={defaultStyles.colors.white}
                  style={styles.cardLabel}
                >
                  {timeline.appointmentDatetime}
                </Label>
              )}

              {timeline.brand && (
                <Label
                  icon="needle"
                  iconColor={defaultStyles.colors.white}
                  style={styles.cardLabel}
                >
                  {timeline.brand}
                </Label>
              )}
            </Card>
          </View>
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    marginTop: 0,
    marginLeft: 20,
    padding: 20,
  },
  cardLabel: {
    color: defaultStyles.colors.white,
    paddingLeft: 10,
  },
  cardTitle: {
    color: defaultStyles.colors.white,
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  cardSubtitle: {
    color: defaultStyles.colors.white,
    paddingBottom: 5,
  },
  date: {
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  dateTime: {
    alignSelf: "flex-start",
    justifyContent: "center",
    width: 90,
  },
  headerTime: {
    color: defaultStyles.colors.medium,
    width: 90,
    textAlign: "center",
  },
  headerEvent: { color: defaultStyles.colors.medium, paddingLeft: 20 },
  row: {
    flexDirection: "row",
    marginVertical: 5,
  },
  time: {
    alignSelf: "center",
    color: defaultStyles.colors.medium,
    textAlign: "center",
  },
  screen: {
    backgroundColor: defaultStyles.colors.white,
    marginBottom: 50,
    padding: 10,
    width: "100%",
  },
});

export default TimelineScreen;
