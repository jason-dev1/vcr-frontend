import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentScreen from "../screens/AppointmentScreen";
import NavigationContext from "./context";
import CompleteRegistrationScreen from "../screens/CompleteRegistrationScreen";
import HomeNavigator from "./HomeNavigator";
import MakeAppointmentScreen from "../screens/MakeAppointmentScreen";

import useNotifications from "../hooks/useNotifications";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  useNotifications();

  const [navigationRefresh, setNavigationRefresh] = useState(NavigationContext);

  return (
    <NavigationContext.Provider
      value={{ navigationRefresh, setNavigationRefresh }}
    >
      <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
        <Stack.Screen name="AppointmentDetail" component={AppointmentScreen} />
        <Stack.Screen
          name="MakeAppointment"
          component={MakeAppointmentScreen}
        />
        <Stack.Screen
          name="CompleteRegistration"
          component={CompleteRegistrationScreen}
        />
      </Stack.Navigator>
    </NavigationContext.Provider>
  );
};

export default AppNavigator;
