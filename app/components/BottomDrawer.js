import React, { useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import defaultStyles from "../config/styles";

let { height } = Dimensions.get("window");
height = height - 100;
const DRAWER_OFFSET = 70;

const BottomDrawer = ({ children, drawerState, setDrawerState }) => {
  const DrawerState = {
    Open: height - DRAWER_OFFSET,
    Peek: 280,
    Closed: 0,
  };

  const handleStateChange = () => {
    animateMoveSpring(y, DrawerState[drawerState]);
  };

  useEffect(() => {
    handleStateChange();
  }, [drawerState]);

  const y = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  const state = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  const margin = 0.05 * height;
  const movementValue = (moveY) => height + DRAWER_OFFSET - moveY;

  const onPanResponderMove = function (_, { moveY }) {
    const val = movementValue(moveY);
    val > DrawerState.Open ? null : animateMoveSpring(y, val);
  };

  const onPanResponderRelease = function (_, { moveY }) {
    const valueToMove = movementValue(moveY);
    const nextState = getNextState(state._value, valueToMove, margin);
    state.setValue(nextState);
    setDrawerState(getKeyByValue(DrawerState, nextState));
    animateMoveSpring(y, nextState);
  };

  const onMoveShouldSetPanResponder = function (_, { dy }) {
    return Math.abs(dy) >= 10;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
      onPanResponderMove: onPanResponderMove,
      onPanResponderRelease: onPanResponderRelease,
    })
  ).current;

  const animateMoveSpring = (y, toValue, callback) => {
    Animated.spring(y, {
      bounciness: 1,
      toValue: -toValue,
      useNativeDriver: false,
      speed: 20,
    }).start((finished) => {
      finished && callback && callback();
    });
  };

  const getNextState = (currentState, val, margin) => {
    switch (currentState) {
      case DrawerState.Peek:
        return val >= currentState + margin
          ? DrawerState.Open
          : val <= DrawerState.Peek - margin
          ? DrawerState.Closed
          : DrawerState.Peek;
      case DrawerState.Open:
        return val >= currentState
          ? DrawerState.Open
          : val <= DrawerState.Peek
          ? DrawerState.Closed
          : DrawerState.Peek;
      case DrawerState.Closed:
        return val >= currentState + margin
          ? val <= DrawerState.Peek + margin
            ? DrawerState.Peek
            : DrawerState.Open
          : DrawerState.Closed;
      default:
        return currentState;
    }
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateY: y }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.line}></View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    bottom: -height + DRAWER_OFFSET,
    elevation: 10,
    height: height,
    padding: 20,
    paddingBottom: 0,
    paddingTop: 10,
    width: "100%",
    position: "absolute",
  },
  line: {
    borderRadius: 20,
    backgroundColor: defaultStyles.colors.normal,
    height: 5,
    alignSelf: "center",
    marginBottom: 15,
    width: "10%",
  },
});

export default BottomDrawer;
