import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Pressable } from "react-native";
import { colors } from "../../constants";

export const ColorView = ({ children, bgColor, BigPP }) => {
  const translation = useRef(new Animated.Value(0)).current;

  const pressed = () => {
    Animated.timing(translation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  if (BigPP) {
    pressed();
  }

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          backgroundColor: translation.interpolate({
            inputRange: [0, 100],
            outputRange: [colors.black, bgColor],
          }),
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
