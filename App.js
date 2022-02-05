import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View} from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants';
import { SafeArea } from './src/utils/SafeArea';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

const tempArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
}

export default function App() {
  
  const word = "hello";
  const letters = word.split('');
  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')));

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing")

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);
  
  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert("Huraayy!🥳🥳", "You Won!");
      setGameState("won");
    }
    if (checkIfLost()) {
      Alert.alert("Meh", "Try Again Tomorrow☺️");
      setGameState("lost");
    }
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    return curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }
    
    const updatedRow = tempArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      updatedRow[curRow][prevCol] = '';
      setRows(updatedRow);
      if (curCol > 0) {
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0)
      }
      return;
    }


    if (curCol < rows[0].length) {
      updatedRow[curRow][curCol] = key;
      setRows(updatedRow);
      setCurCol(curCol + 1);
    }
  }

  const getBGColor = (row, col) => {
    const letter = rows[row][col]

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
  }
  
  const getLetterWithColor = (color) => {
    return rows.flatMap((row, i) => (row.filter((cell, j) => (getBGColor(i, j) === color))));
  }

  const greenCaps = getLetterWithColor(colors.primary);
  const yellowCaps = getLetterWithColor(colors.secondary);
  const greyCaps = getLetterWithColor(colors.darkgrey);

  return (
    <SafeArea style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>

        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((cell, j) => (
            <View key={`cell-${i}-${j}`} style={[styles.cell, {backgroundColor: getBGColor( i, j)}]}>
              <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
            </View>
            ))}      
          </View>
        ))}
      </View>

      <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yellowCaps} greyCaps={greyCaps}/>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  map: { 
    alignSelf: "stretch",
    height: 100
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center"
  },
  cell: {
    flex: 1,
    borderColor: colors.darkgrey,
    borderWidth: 2,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 30,
    fontWeight: "bold"
  }
});
