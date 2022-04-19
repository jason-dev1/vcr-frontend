import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import Text from "../components/Text";

import authApi from "../api/auth";
import defaultStyles from "../config/styles";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

function RegisterScreen({ navigation }) {
  const auth = useAuth();
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const [error, setError] = useState();

  const handleSubmit = async ({ email, password }) => {
    const result = await registerApi.request({ email, password });

    if (!result.ok) {
      if (result.data?.detail) setError(result.data.detail);
      else if (result.data?.email) setError(result.data.email[0]);
      else if (result.data?.password) setError(result.data.password[0]);
      else setError("An unexpected error occurred.");

      return;
    }

    const { data } = await loginApi.request(email, password);
    await auth.logIn(data.access);
    navigation.navigate(routes.COMPLETEREGISTRATION);
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.textTitle}>Register</Text>
      <Text style={styles.textSubtitle}>New account</Text>
      <View style={styles.form}>
        <Form
          initialValues={{ email: "", password: "", passwordConfirmation: "" }}
          onSubmit={handleSubmit}
          style={styles.form}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Sign Up" style={styles.button} />
          <Text style={styles.textNewUser}>
            Existing user?
            <Text
              style={styles.textRegister}
              onPress={() => navigation.navigate(routes.LOGIN)}
            >
              &nbsp;Log In
            </Text>
          </Text>
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
    padding: 15,
    marginTop: 50,
  },
  form: {
    marginVertical: 50,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  textForget: {
    color: defaultStyles.colors.medium,
    fontSize: 14,
    textAlign: "right",
  },
  textNewUser: {
    color: defaultStyles.colors.medium,
    fontSize: 16,
    textAlign: "center",
  },
  textTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 28,
  },
  textRegister: {
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  textSubtitle: {
    color: defaultStyles.colors.medium,
    fontSize: 14,
  },
});

export default RegisterScreen;
