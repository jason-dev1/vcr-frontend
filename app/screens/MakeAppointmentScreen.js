import * as React from "react";
import { Alert, StyleSheet, View, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import dayjs from "dayjs";

import ActivityIndicator from "../components/ActivityIndicator";
import BottomDrawer from "../components/BottomDrawer";
import Button from "../components/Button";
import Card from "../components/Card";
import DoneAnimation from "../components/DoneAnimation";
import Label from "../components/Label";
import AppList from "../components/List";
import Text from "../components/Text";
import TextInput from "../components/TextInput";

import appointmentsApi from "../api/appointments";
import centersApi from "../api/centers";
import defaultStyles from "../config/styles";
import NavigationContext from "../navigation/context";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";
import useLocation from "../hooks/useLocation";

// Only for project purpose only. Never store sensitive API keys in the app code.
// The most secure way to handle this would be to build an orchestration layer between the app and the resource, e.g. serverless function
const GOOGLE_PLACES_API_KEY = "ENTER_YOUR_GOOGLE_PLACES_API_KEY_HERE";

const SORT = ["distance", "cases", "name"];

function MakeAppointmentScreen({ navigation }) {
  const currentLocation = useLocation();

  const getNearbyCentersApi = useApi(centersApi.getNearbyCenters);
  const getTimeslotsApi = useApi(centersApi.getTimeslots);
  const makeAppointmentApi = useApi(appointmentsApi.addAppointment);

  const [centers, setCenters] = React.useState([]);
  const [doneAnimation, setDoneAnimation] = React.useState(false);
  const [drawerState, setDrawerState] = React.useState("Closed");
  const [location, setLocation] = React.useState();
  const [timeslots, setTimeslots] = React.useState([]);
  const [selectedCenter, setSelectedCenter] = React.useState();
  const [selectedTimeslot, setSelectedTimeslot] = React.useState();
  const [sortIndex, setSortIndex] = React.useState(0);
  const [focusLocation, setFocusLocation] = React.useState({
    latitude: 4,
    longitude: 102,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const { navigationRefresh, setNavigationRefresh } =
    React.useContext(NavigationContext);

  const focusedDelta = { latitudeDelta: 0.1, longitudeDelta: 0.1 };
  const markers = [];

  const populateTimeslot = async (id) => {
    const result = await getTimeslotsApi.request(id);

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve appointment details.");

      return;
    }

    const timeslots = result.data;

    timeslots.sort((a, b) => b.timeslot - a.timeslot);
    for (let timeslot of timeslots) {
      timeslot.formatted_datetime = dayjs(timeslot.datetime).format(
        "DD MMM YYYY HH:mm A (ddd)"
      );
    }
    setTimeslots(timeslots);
  };

  const processCenterPath = (data) => {
    for (let center of data) {
      let converted_path = [];
      for (let coord of center.path) {
        let coord_json = {};
        coord_json.latitude = coord[1];
        coord_json.longitude = coord[0];
        converted_path.push(coord_json);
      }
      center.path = converted_path;
    }
    return data;
  };

  const handleCenterSelect = async (id) => {
    setDrawerState("Peek");
    setTimeslots([]);
    setSelectedTimeslot();
    const center = centers.filter((center) => {
      return center.id + "" === id + "";
    })[0];
    setSelectedCenter(center);
    markers[id].showCallout();
    setFocusLocation({
      ...focusedDelta,
      latitude: center.lat,
      longitude: center.lng,
    });

    setTimeout(() => populateTimeslot(id), 400);
  };

  const handleNearbyCentersQuery = async (latitude, longitude) => {
    if (!latitude && !longitude) {
      // Handle no location
      Alert.alert(
        "Error",
        "Unable to retrieve your current location. \nEnsure that you have granted the location permission."
      );
      return;
    }

    setDrawerState("Closed");
    setLocation({ latitude, longitude });
    setFocusLocation({ ...focusedDelta, latitude, longitude });
    setCenters([]);
    setSelectedCenter();
    setSelectedTimeslot();
    setSortIndex(0);

    const result = await getNearbyCentersApi.request(latitude, longitude);

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else
        Alert.alert("Error", "Failed to retrieve nearby vaccination centers.");

      return;
    }

    setCenters(processCenterPath(result.data));
    setDrawerState("Peek");
  };

  const handleSort = async () => {
    if (centers.length < 1) return;

    const sortID = sortIndex + 1;
    setSortIndex(sortID);

    const vcenters = [...centers];
    const field = SORT[sortID % SORT.length];

    if (field === "name")
      vcenters.sort((a, b) => a[field].localeCompare(b[field]));
    else vcenters.sort((a, b) => a[field] - b[field]);

    setCenters(vcenters);
  };

  const handleSubmit = async () => {
    if (!selectedTimeslot)
      return Alert.alert("Error", "Please select an available timeslot");

    const result = await makeAppointmentApi.request(selectedTimeslot.id);

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "An unexpected error occurred.");

      return;
    }

    setNavigationRefresh({ refresh: true });
    setDoneAnimation(true);
  };

  const handleDoneAnimationFinished = async () => {
    setDoneAnimation(false);
    navigation.navigate(routes.APPOINTMENT);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <>
      <ActivityIndicator name="finding" visible={getNearbyCentersApi.loading} />
      <DoneAnimation
        onDone={() => handleDoneAnimationFinished()}
        visible={doneAnimation}
        speed={1.25}
      ></DoneAnimation>

      <View style={styles.screen}>
        <MapView style={styles.mapView} region={focusLocation}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              key={location}
              image={require("../assets/map_icons/current_location.png")}
              title="Me"
              description="Your Current Location"
            />
          )}
          {centers &&
            centers.map((center) => (
              <Marker
                coordinate={{ latitude: center.lat, longitude: center.lng }}
                description={center.distance + " km"}
                identifier={center.id.toString()}
                image={require("../assets/map_icons/location.png")}
                key={center.id}
                ref={(ref) => (markers[center.id] = ref)}
                title={center.name}
                onPress={({ nativeEvent }) =>
                  handleCenterSelect(nativeEvent.id)
                }
              />
            ))}

          {selectedCenter && (
            <>
              <Polyline
                coordinates={[
                  {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                  {
                    latitude: selectedCenter.path[0].latitude,
                    longitude: selectedCenter.path[0].longitude,
                  },
                ]}
                strokeColor={defaultStyles.colors.primary}
                strokeWidth={5}
                lineDashPattern={[1, 20]}
              />
              <Polyline
                coordinates={selectedCenter.path}
                strokeColor={defaultStyles.colors.primary}
                strokeWidth={5}
              />
              <Polyline
                coordinates={[
                  {
                    latitude: selectedCenter.lat,
                    longitude: selectedCenter.lng,
                  },
                  {
                    latitude:
                      selectedCenter.path[selectedCenter.path.length - 1]
                        .latitude,
                    longitude:
                      selectedCenter.path[selectedCenter.path.length - 1]
                        .longitude,
                  },
                ]}
                strokeColor={defaultStyles.colors.primary}
                strokeWidth={5}
                lineDashPattern={[1, 20]}
              />
            </>
          )}
        </MapView>

        <View style={styles.locationBar}>
          <View style={styles.locationAddressInput}>
            <GooglePlacesAutocomplete
              enablePoweredByContainer={false}
              fetchDetails
              textInput={defaultStyles.text}
              styles={{
                row: [],
                description: [
                  defaultStyles.text,
                  {
                    fontSize: 14,
                    zIndex: 1,
                  },
                ],
                textInput: [defaultStyles.text, { marginBottom: 0 }],
              }}
              placeholder="Search address"
              onPress={(data, details = null) => {
                const { lat, lng } = details.geometry.location;
                handleNearbyCentersQuery(lat, lng);
              }}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: "en",
                components: "country:my",
              }}
              textInputProps={{
                containerStyle: { padding: 0, paddingLeft: 10 },
                icon: "magnify",
                InputComp: TextInput,
              }}
            />
          </View>

          <Button
            icon="target"
            color="white"
            style={styles.locationButton}
            onPress={() => {
              handleNearbyCentersQuery(
                currentLocation?.latitude,
                currentLocation?.longitude
              );
            }}
          ></Button>
        </View>

        <BottomDrawer drawerState={drawerState} setDrawerState={setDrawerState}>
          <Text style={styles.title}>
            {selectedCenter
              ? "Selected vaccination center"
              : "No vaccination center selected"}
          </Text>

          {selectedCenter && (
            <Card style={styles.card}>
              <Label
                icon="map-marker-outline"
                iconColor={defaultStyles.colors.dark}
                textColor={defaultStyles.colors.dark}
              >
                {selectedCenter.name}
              </Label>
              <Label
                icon="map-marker-distance"
                iconColor={defaultStyles.colors.dark}
                textColor={defaultStyles.colors.dark}
              >
                {selectedCenter.distance} kilometres
              </Label>
              <Label
                icon="virus"
                iconColor={defaultStyles.colors.dark}
                textColor={defaultStyles.colors.dark}
              >
                {selectedCenter.cases} case(s) within 1 km radius
              </Label>

              <AppList
                emptyPlaceholder="No timeslot available"
                icon="clock-time-eight-outline"
                iconColor={defaultStyles.colors.dark}
                items={timeslots}
                itemKeyField="id"
                itemNameField="formatted_datetime"
                onSelectItem={setSelectedTimeslot}
                containerStyle={styles.listPickerContainer}
                placeholder="Select a timeslot"
                selectedItem={selectedTimeslot}
              />
            </Card>
          )}

          <Button
            disabled={!selectedCenter ? true : false}
            style={styles.button}
            title="Submit Appointment"
            onPress={handleSubmit}
          ></Button>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.title}>All results</Text>
            <Label
              onPress={handleSort}
              icon="sort-ascending"
              containerStyle={{ flexDirection: "row-reverse", width: "auto" }}
            >
              {capitalizeFirstLetter(SORT[sortIndex % SORT.length])}
            </Label>
          </View>

          <ScrollView>
            {centers.map((center) => (
              <Card
                key={center.id}
                onPress={() => handleCenterSelect(center.id)}
              >
                <Label icon="map-marker-outline">{center.name}</Label>
                <Label icon="map-marker-distance">
                  {center.distance} kilometres
                </Label>
                <Label icon="virus">
                  {center.cases} case(s) within 1 km radius
                </Label>
              </Card>
            ))}
          </ScrollView>
        </BottomDrawer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: { marginVertical: 20 },
  card: { marginBottom: 0 },
  locationAddressInput: {
    flex: 1,
    marginRight: 10,
  },
  locationBar: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    marginHorizontal: 20,
  },
  locationButton: {
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  mapView: {
    width: "100%",
    height: "100%",
  },
  listPickerContainer: {
    marginVertical: 0,
    padding: 0,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
});

export default MakeAppointmentScreen;
