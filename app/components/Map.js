import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

function Map({ latitude, longitude, name, style }) {
  const region = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={[styles.map, style]}
      region={region}
      pitchEnabled={false}
      rotateEnabled={false}
      zoomEnabled={false}
      scrollEnabled={false}
    >
      <Marker
        coordinate={{ latitude: latitude, longitude: longitude }}
        key={name}
        title={name}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
  },
});

export default Map;
