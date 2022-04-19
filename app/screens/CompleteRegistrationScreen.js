import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import dayjs from "dayjs";

import FormDatePicker from "../components/forms/FormDatePicker";
import FormCheck from "../components/forms/FormCheck";
import Label from "../components/Label";
import Screen from "../components/Screen";
import Text from "../components/Text";
import {
  ErrorMessage,
  Form,
  FormField,
  FormListPicker,
  SubmitButton,
} from "../components/forms";

import accountsApi from "../api/accounts";
import routes from "../navigation/routes";
import states from "../config/states";
import useApi from "../hooks/useApi";

const NRIC_REGEX =
  /([0-9][0-9])((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))([0-9][0-9])([0-9][0-9][0-9][0-9])/;

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(5).max(100).label("Name"),
  ic_number: Yup.string()
    .required()
    .min(12, "NRIC must be a 12-digit number")
    .max(12, "NRIC must be a 12-digit number")
    .matches(NRIC_REGEX, "Invalid NRIC")
    .label("NRIC No"),
  date_of_birth: Yup.string().required().label("Date of Birth"),
  country: Yup.string().required().default("Malaysia").label("Country"),
  state: Yup.object().required().label("State"),
  isTermAccepted: Yup.boolean()
    .required("The terms and conditions must be accepted.")
    .oneOf([true], "The terms and conditions must be accepted."),
});

function CompleteRegistrationScreen({ navigation }) {
  const updateAccountApi = useApi(accountsApi.updateAccount);
  const [nricDate, setNricDate] = useState();
  const [error, setError] = useState();

  const formatRegistration = (registration) => {
    const registrationData = {
      ...registration,
      state: registration.state.name,
    };

    return registrationData;
  };

  const handleSubmit = async (registration) => {
    const registrationData = formatRegistration(registration);

    const result = await updateAccountApi.request(registrationData);

    if (!result.ok) {
      if (result.data?.detail) setError(result.data.detail);
      else setError("An unexpected error occurred.");

      return;
    }

    navigation.navigate(routes.HOME);
  };

  const handleNRICInput = async (nric) => {
    const rgxGrp = nric.match(NRIC_REGEX);

    if (rgxGrp) {
      let year = rgxGrp[1];
      const month = rgxGrp[2];
      const day = rgxGrp[5];

      const now = new Date().getFullYear().toString();

      const decade = now.substr(0, 2);
      if (now.substr(2, 2) > year)
        year = parseInt(decade.concat(year.toString()), 10);

      const date = new Date(year, month - 1, day, 0, 0, 0, 0);
      setNricDate(dayjs(date).format("YYYY-MM-DD"));
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.textTitle}>Complete Registration</Text>
      <View style={styles.form}>
        <Form
          initialValues={{
            name: "",
            ic_number: "",
            date_of_birth: "",
            country: "Malaysia",
            state: "",
            isTermAccepted: false,
          }}
          onSubmit={handleSubmit}
          style={styles.form}
          validationSchema={validationSchema}
        >
          <View style={styles.fieldGroup}>
            <Label>Name</Label>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="account"
              name="name"
              placeholder="Name"
              textContentType="name"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Label>NRIC No.</Label>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="identifier"
              keyboardType="numeric"
              name="ic_number"
              maxLength={12}
              onEndEditing={handleNRICInput}
              placeholder="NRIC No"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Label>Date of Birth</Label>
            <FormDatePicker
              icon="calendar-today"
              date={nricDate}
              name="date_of_birth"
              placeholder="Date of Birth"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Label>Country</Label>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              editable={false}
              icon="earth"
              name="country"
              placeholder="Malaysia"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Label>State</Label>
            <FormListPicker
              icon="earth"
              items={states}
              itemKeyField="shortCode"
              name="state"
              placeholder="State"
            />
          </View>
          <View style={styles.fieldGroup}>
            <FormCheck name="isTermAccepted">
              I hereby declare that the information provided is true and
              correct.
            </FormCheck>
          </View>
          <ErrorMessage error={error} visible={error} />
          <SubmitButton title="Save Profile" style={styles.button} />
        </Form>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 30,
  },
  container: {
    padding: 10,
    marginTop: 20,
  },
  fieldGroup: {
    marginVertical: 5,
  },
  form: {
    marginVertical: 0,
  },
  textTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    alignSelf: "center",
    marginVertical: 50,
  },
});

export default CompleteRegistrationScreen;
