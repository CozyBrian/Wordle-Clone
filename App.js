import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { colors } from "./src/constants";
import { SafeArea } from "./src/utils/SafeArea";
import Game from "./src/components/Game";

export default function App() {
  return (
    <SafeArea style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>WORDLE</Text>
      <Game />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
});
