import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, CLEAR, ENTER } from "../../constants";
import { DayOfTheYear, tempArray } from "../../utils";
import words from "../../data";
import Keyboard from "../../components/Keyboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FlipInEasyY, ZoomIn } from "react-native-reanimated";
import EndScreen from "../EndScreen";

const NUMBER_OF_TRIES = 6;
const dayOfTheYear = DayOfTheYear() + 2;
const dayKey = `day-${dayOfTheYear}`;

const Game = () => {
  //AsyncStorage.removeItem("@game");
  const word = words[dayOfTheYear];
  const letters = word.split("");
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [gameState, setGameState] = useState("playing");

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  useEffect(() => {
    if (loaded) {
      SaveState();
    }
  }, [rows, curRow, curCol, gameState]);

  useEffect(() => {
    LoadState();
  }, []);

  const SaveState = async () => {
    const dataForToday = {
      rows,
      curRow,
      curCol,
      gameState,
    };

    try {
      const existingStateString = await AsyncStorage.getItem("@game");
      const existingState = existingStateString
        ? JSON.parse(existingStateString)
        : {};

      existingState[dayKey] = dataForToday;
      const dataString = JSON.stringify(existingState);
      await AsyncStorage.setItem("@game", dataString);
    } catch (e) {
      console.log("Failed to save state", e);
    }
  };

  const LoadState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    try {
      const data = JSON.parse(dataString);
      const day = data[dayKey];
      setRows(day.rows);
      setCurRow(day.curRow);
      setCurCol(day.curCol);
      setGameState(day.gameState);
    } catch (e) {
      console.log("Couldn't parse state", e);
    }
    setLoaded(true);
  };

  const checkGameState = () => {
    if (checkIfWon()) {
      setGameState("won");
    } else if (gameState === "playing" && curRow === rows.length) {
      setGameState("lost");
    }
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRow = tempArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      updatedRow[curRow][prevCol] = "";
      setRows(updatedRow);
      if (curCol > 0) {
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }

    if (curCol < rows[0].length) {
      updatedRow[curRow][curCol] = key;
      setRows(updatedRow);
      setCurCol(curCol + 1);
    }
  };

  const getBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getBGColor2 = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    }
    if (row < curRow - 1) {
      if (letter === letters[col]) {
        return colors.primary;
      }
      if (letters.includes(letter)) {
        return colors.secondary;
      }
      return colors.darkgrey;
    }
    return colors.black;
  };

  const getLetterWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getBGColor(i, j) === color)
    );
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const greenCaps = getLetterWithColor(colors.primary);
  const yellowCaps = getLetterWithColor(colors.secondary);
  const greyCaps = getLetterWithColor(colors.darkgrey);

  if (gameState !== "playing") {
    return (
      <EndScreen
        gameState={gameState === "won"}
        rows={rows}
        getBGColor={getBGColor}
      />
    );
  }

  const getCellStyle = (i, j) => [
    styles.cell,
    {
      borderColor: isCellActive(i, j) ? colors.lightgrey : colors.darkgrey,
      backgroundColor: getBGColor(i, j),
    },
  ];

  return (
    <>
      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((cell, j) => (
              <>
                {i < curRow && (
                  <Animated.View
                    key={`cell-color-${i}-${j}`}
                    entering={FlipInEasyY.delay(j * 30)}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                  </Animated.View>
                )}
                {i === curRow && !!cell && (
                  <Animated.View
                    key={`cell-active-${i}-${j}`}
                    entering={ZoomIn}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                  </Animated.View>
                )}
                {!cell && (
                  <Animated.View
                    key={`cell-${i}-${j}`}
                    style={getCellStyle(i, j)}
                  >
                    <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                  </Animated.View>
                )}
              </>
            ))}
          </View>
        ))}
      </View>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    alignSelf: "stretch",
    height: 100,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    flex: 1,
    borderColor: colors.darkgrey,
    borderWidth: 2,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default Game;
