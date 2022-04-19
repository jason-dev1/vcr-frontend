import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://192.168.68.100:8080/api",
  },
  staging: {
    apiUrl: "https://vcr-django.herokuapp.com/api/",
  },
  prod: {
    apiUrl: "https://vcr-django.herokuapp.com/api/",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
