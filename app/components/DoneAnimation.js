import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function DoneAnimation({ onDone, opacity = 0.8, visible = false, speed = 1 }) {
  return (
    <Modal visible={visible} statusBarTranslucent transparent>
      <View
        style={[
          styles.container,
          { backgroundColor: `rgba(255,255,255,${opacity})` },
        ]}
      >
        <LottieView
          autoPlay
          loop={false}
          onAnimationFinish={onDone}
          source={require("../assets/animations/appointment_done.json")}
          style={styles.animation}
          speed={speed}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    alignSelf: "center",
    width: 150,
  },
  container: {
    alignContent: "center",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
});

export default DoneAnimation;
