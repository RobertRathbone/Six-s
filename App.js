import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { colors } from './src/constants';
import Game from './src/components/Game/Game';
import * as FileSystem from 'expo-file-system';
import { setLetters } from './src/utils';
import Animated, {
  SlideInLeft, 
} from 'react-native-reanimated';

const NUMBER_OF_TRIES  = 6;
const sendLetters = setLetters()
const letters = sendLetters.toString().toUpperCase().replace(/,/g, "");

var checkWord = require('check-word'),
words     = checkWord('en');

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff/oneDay);
  return day;
}
const dayOfTheYear = getDayOfYear();


export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Animated.Text entering={SlideInLeft.delay(300)} style={styles.title}>{letters}</Animated.Text>
      <Animated.Text entering={SlideInLeft.delay(600)} style={styles.subtitle}>1111234566</Animated.Text>
      <Game letters ={sendLetters}/>
    </SafeAreaView>
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
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 'bold',
    letterSpacing: 15,
    marginVertical: 20,
    
  },
  subtitle: {
    color: colors.lightgrey,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 22,
    lineHeight: 23,
  },
});
