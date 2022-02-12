import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";
import { ColorView } from "../../components/view/color-view";
import { DayOfTheYear, tempArray } from "../../utils";
import words from "../../data";
import * as Clipboard from "expo-clipboard";
import Keyboard from "../../components/Keyboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NUMBER_OF_TRIES = 6;

const Game = () => {
  const dayOfTheYear = DayOfTheYear();
  const word = words[dayOfTheYear];
  const letters = word.split("");
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [bigPP, setBigPP] = useState(false);
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
    const data = {
      rows,
      curRow,
      curCol,
      gameState,
    };

    try {
      const dataString = JSON.stringify(data);
      await AsyncStorage.setItem("@game", dataString);
    } catch (e) {
      console.log("Failed to save state", e);
    }
  };

  const LoadState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    try {
      const data = JSON.parse(dataString);
      setRows(data.rows);
      setCurRow(data.curRow);
      setCurCol(data.curCol);
      setGameState(data.gameState);
      setBigPP(true);
    } catch (e) {
      console.log("Couldn't parse state", e);
    }
    console.log(dataString);

    setLoaded(true);
  };

  const checkGameState = () => {
    if (checkIfWon()) {
      setGameState("won");
      Alert.alert("Huraayy!🥳🥳", "You Won!", [
        { text: "Share", onPress: shareScore },
      ]);
    } else if (gameState === "playing" && curRow === rows.length) {
      Alert.alert("Meh", "Try Again Tomorrow☺️");
      setGameState("lost");
    }
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    setTimeout(() => {
      if (curRow === rows.length && gameState !== "won") {
        return true;
      }
    }, 50);

    // if (gameState !== "won") {
    //   return false;
    // } else if (curRow === rows.length) {
    //   return true;
    // }
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle \n\n ${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert("Score Copied", "You can share your score to social media ");
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
        setBigPP(true);
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

  return (
    <>
      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((cell, j) => (
              <ColorView
                key={`cell-${i}-${j}`}
                bgColor={getBGColor(i, j)}
                bgColor2={getBGColor2(i, j)}
                BigPP={bigPP}
                rows={curRow}
                bor={isCellActive(i, j)}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </ColorView>
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