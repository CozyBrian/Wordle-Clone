import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import { colors } from "../../constants";

export const ColorView = ({
  children,
  bgColor,
  bgColor2,
  BigPP,
  rows,
  bor,
}) => {
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 100,
      duration: 100,
      useNativeDriver: false,
    }).reset();
  }, [rows]);

  const pressed = () => {
    Animated.timing(translation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  if (BigPP) {
    setTimeout(() => {
      pressed();
    }, 1);
  }

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          backgroundColor: translation.interpolate({
            inputRange: [0, 100],
            outputRange: [bgColor2, bgColor],
          }),
          borderColor: bor ? colors.lightgrey : colors.darkgrey,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    borderColor: colors.darkgrey,
    flexDirection: "row",
    borderWidth: 2,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
