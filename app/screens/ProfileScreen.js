import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import AppList from "../components/List";
import Button from "../components/Button";
import DatePicker from "../components/DatePicker";
import FormModalEdit from "../components/FormModalEdit";
import { FormField } from "../components/forms";
import Label from "../components/Label";
import Screen from "../components/Screen";

import accountsApi from "../api/accounts";
import states from "../config/states";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";

import AvatarSVG from "../assets/avatar.svg";

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required().min(8).label("Current password"),
  new_password: Yup.string().required().min(8).label("New password"),
});

const ProfileScreen = () => {
  const { user, logOut } = useAuth();

  const getAccountApi = useApi(accountsApi.getAccount);
  const updateAccountApi = useApi(accountsApi.updateAccount);
  const resetPasswordApi = useApi(usersApi.resetPassword);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    ic_number: "",
    date_of_birth: "",
    country: "",
    state: "",
  });

  const serializeProfile = (profile) => {
    return profile.state
      ? {
          ...profile,
          state: { name: profile.state },
        }
      : profile;
  };

  const deserializeProfile = (profile) => {
    return profile.state
      ? {
          ...profile,
          state: profile.state.name,
        }
      : profile;
  };

  const initializeProfile = async () => {
    const result = await getAccountApi.request();

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "Failed to retrieve profile details.");

      return;
    }

    setProfile({ ...serializeProfile(result.data), email: user.email });
  };

  useEffect(() => {
    initializeProfile();
  }, []);

  const handleProfileUpdate = async (field, value) => {
    const updatedField = { [field]: value };

    const result = await updateAccountApi.request(
      deserializeProfile(updatedField)
    );

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else Alert.alert("Error", "An unexpected error occurred.");

      return;
    }

    setProfile({ ...profile, ...updatedField });
  };

  const handlePasswordReset = async (payload) => {
    const result = await resetPasswordApi.request(payload);

    if (!result.ok) {
      if (result.data?.detail) Alert.alert("Error", result.data.detail);
      else if (result.data?.current_password)
        Alert.alert("Current Password Error", result.data?.current_password[0]);
      else if (result.data?.new_password)
        Alert.alert("New Password Error", result.data?.new_password[0]);
      else Alert.alert("Error", "An unexpected error occurred.");

      return;
    }
  };

  const handleLogOut = async () => {
    const buttons = [{ text: "No" }, { text: "Yes", onPress: () => logOut() }];
    Alert.alert("Log Out", "Are you sure you want to log out?", buttons);
  };

  return (
    <Screen style={styles.screen}>
      <View>
        <View style={[styles.field]}>
          <AvatarSVG style={styles.image} height={80} width={80} />
        </View>
        <View>
          <View style={styles.fieldGroup}>
            <Label>Name</Label>
            <FormModalEdit
              icon="account"
              editable={false}
              placeholder="Name"
              value={profile.name}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Email</Label>
            <FormModalEdit
              icon="email"
              editable={false}
              placeholder="Email"
              value={profile.email}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Password</Label>
            <FormModalEdit
              icon="lock"
              placeholder="Password"
              onSave={(e) => handlePasswordReset(e)}
              validationSchema={validationSchema}
              value="••••••••"
            >
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="current_password"
                placeholder="Current Password"
                secureTextEntry
                textContentType="password"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="new_password"
                placeholder="New Password"
                secureTextEntry
                textContentType="password"
              />
            </FormModalEdit>
          </View>

          <View style={styles.fieldGroup}>
            <Label>NRIC No.</Label>
            <FormModalEdit
              editable={false}
              icon="identifier"
              placeholder="NRIC No"
              value={profile.ic_number}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Date of Birth</Label>
            <DatePicker
              icon="calendar-today"
              name="date_of_birth"
              onSelectDate={(e) => handleProfileUpdate("date_of_birth", e)}
              maximumDate={new Date()}
              selectedDate={profile.date_of_birth}
              placeholder="Date of Birth"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>Country</Label>
            <FormModalEdit
              editable={false}
              icon="earth"
              placeholder="Country"
              value={profile.country}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Label>State</Label>
            <AppList
              icon="earth"
              items={states}
              itemKeyField="shortCode"
              selectedItem={profile.state}
              onSelectItem={(e) => handleProfileUpdate("state", e)}
              name="state"
              placeholder="State"
            />
          </View>
        </View>
      </View>

      <Button
        color="danger"
        onPress={() => handleLogOut()}
        title="Log Out"
        style={styles.button}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: { marginVertical: 20 },
  field: {
    marginVertical: 5,
  },
  fieldGroup: {
    marginVertical: 5,
  },
  image: {
    alignSelf: "center",
    width: 80,
    height: 80,
  },
  screen: {
    marginBottom: 50,
    padding: 15,
  },
});

export default ProfileScreen;
