import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function ActivityIndicator({
  name = "loading",
  opacity = 0.8,
  visible = false,
}) {
  if (!visible) return null;

  let animation = require("../assets/animations/loading_wave.json");

  if (name === "loading")
    animation = require("../assets/animations/loading_wave.json");
  else if (name === "finding")
    animation = require("../assets/animations/finding_location.json");

  return (
    <Modal visible={visible} statusBarTranslucent transparent>
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(255,255,255,${opacity})` },
        ]}
      >
        <LottieView
          autoPlay
          loop
          source={animation}
          style={styles.lottie}
          resizeMode="cover"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  lottie: {
    alignSelf: "center",
    width: 200,
  },
  overlay: {
    alignContent: "center",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
});

export default ActivityIndicator;
