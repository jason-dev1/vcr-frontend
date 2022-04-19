import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import ActivityIndicator from "../components/ActivityIndicator";
import Card from "../components/Card";
import Label from "../components/Label";
import LineChart from "../components/LineChart";
import Screen from "../components/Screen";
import Text from "../components/Text";

import appointmentsApi from "../api/appointments";
import defaultStyles from "../config/styles";
import NavigationContext from "../navigation/context";
import routes from "../navigation/routes";
import statisticApi from "../api/statistic";
import recordsApi from "../api/records";
import useApi from "../hooks/useApi";

import AppointmentSVG from "../assets/appointment.svg";
import VaccinatedSVG from "../assets/vaccinated.svg";

import CONSTANTS from "../config/constants";

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const getAppointmentsApi = useApi(appointmentsApi.getAppointments);
  const getStatisticApi = useApi(statisticApi.getStatistic);
  const getRecordsApi = useApi(recordsApi.getRecords);

  const [currentAppointment, setCurrentAppointment] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [statistic, setStatistic] = useState();
  const [toRefresh, setToRefresh] = useState(false);
  const [vaccinationStatus, setVaccinationStatus] = useState();

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
        //Probably only show approved appointment
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

  const initializeStatistic = async () => {
    const result = await getStatisticApi.request();

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve vaccination details.");

      return;
    }

    setStatistic(result.data);
  };

  const initializeRecords = async () => {
    const result = await getRecordsApi.request();

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve vaccination details.");

      return;
    }

    const records = result.data;

    if (records.length < 1) {
      const status = "Not vaccinated";
      setVaccinationStatus({
        amount: 0,
        datetime: null,
        status: status,
      });
    } else {
      records.sort((a, b) => b.appointment.dose_type - a.appointment.dose_type);
      const status =
        records[0].appointment.dose_type > 1
          ? "Fully Vaccinated"
          : "Partial Vaccinated";
      setVaccinationStatus({
        amount: records.length,
        datetime: records[0].dose_receive_datetime,
        status: status,
      });
    }
  };

  const initializeData = async () => {
    await Promise.all([
      initializeAppointments(),
      initializeRecords(),
      initializeStatistic(),
    ]);
  };

  useEffect(() => {
    isFocused ? initializeData() : setToRefresh(true);
  }, [navigationRefresh]);

  useFocusEffect(
    React.useCallback(() => {
      if (!toRefresh) return;

      setToRefresh(false);
      handleRefresh();
    }, [toRefresh])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  }, []);

  return (
    <>
      <ActivityIndicator
        visible={
          (getStatisticApi.loading ||
            getAppointmentsApi.loading ||
            getRecordsApi.loading) &&
          !refreshing
        }
        opacity={1}
      />

      <Screen
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.screen}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>

          {currentAppointment && (
            <Card
              style={styles.cardInfo}
              onPress={() => navigation.navigate(routes.APPOINTMENT)}
            >
              <AppointmentSVG width={80} height={80} />
              <View style={styles.cardDescription}>
                <Text style={styles.cardTitle}>
                  {CONSTANTS.DOSE_TYPE[currentAppointment.dose_type]} Dose
                  Appointment
                </Text>

                <Label
                  icon={
                    CONSTANTS.APPOINTMENT_STATUS[
                      currentAppointment.appointment_status
                    ] == "Pending"
                      ? "progress-alert"
                      : "progress-check"
                  }
                >
                  {
                    CONSTANTS.APPOINTMENT_STATUS[
                      currentAppointment.appointment_status
                    ]
                  }
                </Label>

                <Label icon="clock-time-eight-outline" overflowAnimated>
                  {dayjs(currentAppointment.timeslot.datetime).format(
                    "DD/MM/YYYY HH:mm A"
                  )}
                </Label>

                <Label icon="map-marker-outline" overflowAnimated>
                  {currentAppointment.timeslot.center.name}
                </Label>
              </View>
            </Card>
          )}

          {vaccinationStatus && (
            <Card
              style={styles.cardInfo}
              onPress={() => navigation.navigate(routes.APPOINTMENT)}
            >
              <VaccinatedSVG width={80} height={80} />
              <View style={styles.cardDescription}>
                <Text style={styles.cardTitle}>{vaccinationStatus.status}</Text>
                {vaccinationStatus.datetime && (
                  <>
                    <Label icon="clock-time-eight-outline">
                      Latest:&nbsp;
                      {dayjs(vaccinationStatus.datetime).format(
                        "DD/MM/YYYY HH:mm A"
                      )}
                    </Label>
                    <Label icon="check-circle-outline">
                      You have taken&nbsp;
                      {CONSTANTS.DOSE_TYPE[vaccinationStatus.amount]}
                      &nbsp;dose
                    </Label>
                  </>
                )}

                {!vaccinationStatus.datetime && !currentAppointment && (
                  <Text>Click here to make appointment</Text>
                )}

                {!vaccinationStatus.datetime && currentAppointment && (
                  <Text>
                    Your vaccination status will be updated once you have
                    received your first dose
                  </Text>
                )}
              </View>
            </Card>
          )}
        </View>

        {statistic && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics at a Glance</Text>
            <Card style={styles.cardStatistic}>
              <LineChart
                data={statistic}
                legendWidth={270}
                lines={[
                  {
                    color: defaultStyles.colors.calicoBlue,
                    name: "First",
                    x: "date",
                    y: "daily_partial",
                  },
                  {
                    color: defaultStyles.colors.cyanBlue,
                    name: "Second",
                    x: "date",
                    y: "daily_full",
                  },
                  {
                    color: defaultStyles.colors.yellowGreen,
                    name: "Booster",
                    x: "date",
                    y: "daily_booster",
                  },
                  {
                    color: defaultStyles.colors.vineGreen,
                    name: "Total",
                    x: "date",
                    y: "daily",
                  },
                ]}
                title="Daily Vaccine Dose"
              />
            </Card>
            <Card style={styles.cardStatistic}>
              <LineChart
                data={statistic}
                legendWidth={190}
                lines={[
                  {
                    color: defaultStyles.colors.calicoBlue,
                    name: "First",
                    x: "date",
                    y: "cumul_partial",
                  },
                  {
                    color: defaultStyles.colors.cyanBlue,
                    name: "Second",
                    x: "date",
                    y: "cumul_full",
                  },
                  {
                    color: defaultStyles.colors.yellowGreen,
                    name: "Booster",
                    x: "date",
                    y: "cumul_booster",
                  },
                ]}
                title="Cummulative Vaccinated"
              />
            </Card>
          </View>
        )}
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  cardDescription: {
    flex: 1,
    marginHorizontal: 20,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    flex: 1,
  },
  cardStatistic: {
    padding: 5,
  },
  screen: {
    marginBottom: 50,
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: defaultStyles.colors.semiDark,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
});

export default HomeScreen;
