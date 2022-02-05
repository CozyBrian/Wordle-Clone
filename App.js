import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import { colors } from './src/constants';
import { SafeArea } from './src/utils/SafeArea';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

export default function App() {
  const word = "hello";
  const letters = word.split('');

  const rows = new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('a'));

  return (
    <SafeArea style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>

        {rows.map((row) => (
          <View style={styles.row}>
            {row.map((cell) => (
            <View style={styles.cell}>
              <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
            </View>
            ))}      
          </View>
        ))}
      </View>

      <Keyboard/>
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
