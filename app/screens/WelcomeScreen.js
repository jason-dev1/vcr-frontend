import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import Button from "../components/Button";
import Screen from "../components/Screen";
import Text from "../components/Text";

import defaultStyles from "../config/styles";
import routes from "../navigation/routes";

function SplashScreen({ navigation }) {
  return (
    <Screen style={styles.screen} contentContainerStyle={styles.screenContent}>
      <View style={styles.logoContainer}>
        <LottieView
          autoPlay
          loop
          source={require("../assets/animations/taking_vaccination.json")}
          style={styles.lottie}
        />
        <Text style={styles.logoTitle}>
          Vaccination Centre Recommendation App
        </Text>
        <Text style={styles.logoSubtitle}>
          Suggesting the nearest vaccination centre with shortest path algorithm
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Get Started"
          style={styles.button}
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 50,
    width: "100%",
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 30,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 70,
  },
  logoTitle: {
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  logoSubtitle: {
    color: defaultStyles.colors.medium,
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    paddingVertical: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  lottie: {
    width: 350,
    alignSelf: "center",
  },
  screen: {
    backgroundColor: defaultStyles.colors.white,
    padding: 15,
  },
  screenContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default SplashScreen;
