import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { colors } from './src/constants';
import Game from './src/components/Game/Game';
import StartPage from './src/components/StartPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLetters, getDayOfYear, getDayOfYearKey } from './src/utils';
import LetterList from './src/utils/LetterList';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, {
  SlideInLeft, 
} from 'react-native-reanimated';

const NUMBER_OF_TRIES  = 6;
var sendLetters = setLetters()
const Stack = createNativeStackNavigator();
const dailyLetters = LetterList[dayOfTheYear];


// const getDayOfYear = () => {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 0);
//   const diff = now - start;
//   const oneDay = 1000 * 60 * 60 * 24;
//   const day = Math.floor(diff/oneDay);
//   return day;
// }
const dayOfTheYear = getDayOfYear();
const dayOfTheYearKey = getDayOfYearKey();
const dayKey = `day-${dayOfTheYearKey}`

// const readState = async () => {
//   const dataString = await AsyncStorage.getItem('@game');
//   try {
//     const data = JSON.parse(dataString);
//     const day = data[dayKey];
//     if (day.dayOfTheYear == dayOfTheYear){
//       sendLetters= day.dayLetters;
//       console.log ("********************************************Boo", day.dayLetters[0]);
//     }
//     else {
//       sendLetters = setLetters();
//       console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Yippee")
//     }
//   } catch (e) {
//     sendLetters = setLetters();
//     console.log('Could not parse the state', e, dayKey);
//   };

// }
const letters = sendLetters.toString().toUpperCase().replace(/,/g, "");




export default function App() {
  // useEffect(() => {
  //   readState();
  // }, []);
  

  return (
    <NavigationContainer>
    {/* <SafeAreaView style={styles.container}> */}
      <StatusBar style="light" />
      <Stack.Navigator>
                <Stack.Screen
                name="Six(S)"
                component={StartPage}
                // options={{ letters: {dailyLetters}}}
                />
                <Stack.Screen
                name="Game"
                component={Game}
                options={{ letters: {sendLetters}}}
                />

            </Stack.Navigator>
      {/* <StartPage /> */}
      {/* <Animated.Text entering={SlideInLeft.delay(300)} style={styles.title}>{letters}</Animated.Text>
      <Animated.Text entering={SlideInLeft.delay(600)} style={styles.subtitle}>1111234566</Animated.Text>
      <Game letters ={sendLetters}/> */}
    {/* </SafeAreaView> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'white',
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
