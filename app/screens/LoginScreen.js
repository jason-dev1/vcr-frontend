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
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
});

function LoginScreen({ navigation }) {
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password);

    if (!result.ok) {
      if (result.data?.detail) setError(result.data.detail);
      else setError("An unexpected error occurred.");

      return;
    }

    await auth.logIn(result.data.access);
  };

  return (
    <Screen style={styles.screen}>
      <Text style={styles.textTitle}>Log In</Text>
      <Text style={styles.textSubtitle}>Existing account</Text>
      <View style={styles.form}>
        <Form
          initialValues={{ email: "", password: "" }}
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
          <SubmitButton title="Login" style={styles.button} />
          <Text style={styles.textNewUser}>
            New user?&nbsp;
            <Text
              style={styles.textRegister}
              onPress={() => navigation.navigate(routes.REGISTER)}
            >
              Register Now
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
  screen: {
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

export default LoginScreen;
