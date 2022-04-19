import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import dayjs from "dayjs";

import Screen from "../components/Screen";
import Button from "../components/Button";
import Card from "../components/Card";
import Map from "../components/Map";
import Text from "../components/Text";

import appointmentsApi from "../api/appointments";
import defaultStyles from "../config/styles";
import NavigationContext from "../navigation/context";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";

import CONSTANTS from "../config/constants";

const AppointmentScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const getAppointmentsApi = useApi(appointmentsApi.getAppointments);
  const updateAppointmentApi = useApi(appointmentsApi.updateAppointment);

  const [currentAppointment, setCurrentAppointment] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [toRefresh, setToRefresh] = useState(false);

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

    for (let appointment of appointments) {
      const currentDate = dayjs();
      const appointmentDate = dayjs(appointment.timeslot.datetime);

      if (appointmentDate.diff(currentDate, "d") > -1) {
        if (
          appointment.appointment_status >= 1 &&
          appointment.appointment_status <= 2
        ) {
          setCurrentAppointment(appointment);
          return;
        }
      }
    }

    setCurrentAppointment();
  };

  const handleCancelAppointment = async () => {
    const result = await updateAppointmentApi.request(currentAppointment.id, {
      appointment_status: -1,
    });

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "An unexpected error occurred.");

      return;
    }

    setNavigationRefresh({ refresh: true });
    Notifications.cancelAllScheduledNotificationsAsync();
  };

  const handleCancelConfirmation = async () => {
    const buttons = [
      { text: "No" },
      { text: "Yes", onPress: () => handleCancelAppointment() },
    ];
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel the appointment? This cannot be undone.",
      buttons
    );
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeAppointments();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    isFocused ? initializeAppointments() : setToRefresh(true);
  }, [navigationRefresh]);

  useFocusEffect(
    React.useCallback(() => {
      if (!toRefresh) return;

      setToRefresh(false);
      handleRefresh();
    }, [toRefresh])
  );

  return (
    <Screen
      contentContainerStyle={{ flexGrow: 1 }}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      style={[
        styles.screen,
        {
          backgroundColor: currentAppointment
            ? defaultStyles.colors.light
            : defaultStyles.colors.white,
        },
      ]}
    >
      {!currentAppointment && (
        <>
          <View style={styles.containerCenter}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={150}
              color={defaultStyles.colors.normal}
              style={styles.icon}
            />
            <Text style={styles.placeholderTitle}>
              You don't have any appointments
            </Text>
            <Text style={styles.placeholderSubtitle}>
              Make appointment and it'll be shown here
            </Text>
          </View>
          <Button
            title="Make Appointment"
            color="primary"
            onPress={() => navigation.navigate(routes.MAKEAPPOINTMENT)}
            style={styles.button}
          ></Button>
        </>
      )}

      {currentAppointment && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>
            {CONSTANTS.DOSE_TYPE[currentAppointment.dose_type]} Dose Appointment
          </Text>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Appointment Status:</Text>
            <Text style={styles.cardFieldContent}>
              {
                CONSTANTS.APPOINTMENT_STATUS[
                  currentAppointment.appointment_status
                ]
              }
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Recipient Name:</Text>
            <Text style={styles.cardFieldContent}>
              {currentAppointment.account.name}
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Recipient NRIC No:</Text>
            <Text style={styles.cardFieldContent}>
              {currentAppointment.account.ic_number}
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Date:</Text>
            <Text style={styles.cardFieldContent}>
              {dayjs(currentAppointment.timeslot.datetime).format("DD/MM/YYYY")}
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Time:</Text>
            <Text style={styles.cardFieldContent}>
              {dayjs(currentAppointment.timeslot.datetime).format("HH:mm")}
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Location Name:</Text>
            <Text style={styles.cardFieldContent}>
              {currentAppointment.timeslot.center.name}
            </Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardFieldLabel}>Location Map:</Text>
            <View style={styles.mapView}>
              <Map
                latitude={
                  currentAppointment.timeslot.center.location.coordinates[1]
                }
                longitude={
                  currentAppointment.timeslot.center.location.coordinates[0]
                }
                name={currentAppointment.timeslot.center.name}
                style={styles.map}
              />
            </View>
          </View>

          <Button
            title="Cancel Appointment"
            color="danger"
            onPress={() => handleCancelConfirmation()}
          ></Button>
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: { marginVertical: 20 },
  card: {
    padding: 20,
    marginBottom: 30,
  },
  cardField: {
    marginVertical: 5,
  },
  cardFieldContent: { fontFamily: "Poppins_600SemiBold" },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  cardFieldLabel: {
    color: defaultStyles.colors.medium,
  },
  containerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  map: {
    height: 300,
    width: "100%",
  },
  mapView: {
    borderRadius: 15,
    elevation: 5,
    overflow: "hidden",
  },
  placeholderTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    textAlign: "center",
  },
  placeholderSubtitle: {
    fontSize: 18,
    textAlign: "center",
  },
  screen: {
    marginBottom: 50,
    padding: 10,
  },
});

export default AppointmentScreen;
