import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import dayjs from "dayjs";

import accountsApi from "../api/accounts";
import useApi from "./useApi";

export default useNotifications = () => {
  const updateAccountApi = useApi(accountsApi.updateAccount);

  const handleNotificationReceived = async (notification) => {
    if (notification.request.trigger.type !== "push") return;

    const data = notification.request.content.data;

    // Approved - Schedule notification 1 hour before appointment timeslot
    if (data.appointment_status === 2) {
      const scheduledDatetime = dayjs(data.timeslot.datetime).subtract(
        1,
        "hour"
      );
      const trigger = scheduledDatetime.toDate();

      await Notifications.cancelAllScheduledNotificationsAsync();

      Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder: You have an appointment today",
          body: "Please visit to the vaccination center in time.",
        },
        trigger,
      });
    }
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    registerForPushNotifications();

    Notifications.addNotificationReceivedListener(handleNotificationReceived);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted")
        console.log("Failed to get push token for push notification!");

      token = (await Notifications.getExpoPushTokenAsync()).data;

      const result = await updateAccountApi.request({
        expo_notification_token: token,
      });

      if (!result.ok) console.log("Failed to save push token to database!");
    } catch (error) {
      console.log("Error getting a push token", error);
    }

    return token;
  };
};
