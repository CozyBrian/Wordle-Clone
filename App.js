import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import { colors } from './src/constants';
import { SafeArea } from './src/utils/SafeArea';
import Keyboard from './src/components/Keyboard';

export default function App() {
  return (
    <SafeArea style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        <View style={styles.row}>
          <View style={styles.cell}/>
          <View style={styles.cell}/>
          <View style={styles.cell}/>
          <View style={styles.cell}/>
          <View style={styles.cell}/>
        </View>
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
  },
  cell: {
    flex: 1,
    height: 30,
    borderColor: colors.darkgrey,
    borderWidth: 2,
    aspectRatio: 1,
    margin: 5,
    
  },
});
