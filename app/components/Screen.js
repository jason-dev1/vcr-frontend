import React from "react";
import {
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

import defaultStyles from "../config/styles";

function Screen({
  children,
  contentContainerStyle,
  onRefresh,
  refreshing,
  style,
}) {
  return (
    <SafeAreaView style={[styles.screen]}>
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : null
        }
        style={[styles.scrollView, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: defaultStyles.colors.light,
    flex: 1,
  },
  scrollView: {
    backgroundColor: defaultStyles.colors.light,
    flex: 1,
  },
});

export default Screen;
