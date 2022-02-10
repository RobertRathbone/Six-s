import { useEffect, useState, Pressable } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator  } from 'react-native';
import { colorsToEmoji, colors, CLEAR, ENTER } from '../../constants';;
import Keyboard from '../Keyboard';
import * as Clipboard  from 'expo-clipboard';
import { copyArray, getDayOfYear, getDayOfYearKey } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '../../utils/words';

const NUMBER_OF_TRIES  = 8;
const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

const dayOfTheYear = getDayOfYear();
const dayOfTheYearKey = getDayOfYearKey();
const dayKey = `day-${dayOfTheYearKey}`


const Game = ({letters}) => {
  AsyncStorage.removeItem('@game');
  const [rows, setRows] = useState(
    new Array(6).fill(new Array(6).fill(''))); // creates 2D array of empty boxes
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [loaded, setLoaded] = useState(false);
  const [dayLetters, setDayLetters] = useState(letters);
  const [timerCount, setTimer] = useState(360);
  const [showScore, setShowScore] = useState(0);
  var score = 0;

  const setGreyCaps = () => {
      for (let i = 0; i<12; i++){
          if (alphabet.includes(dayLetters[i])){
              alphabet.splice(alphabet.indexOf(dayLetters[i]),1);
          };
      };
      return alphabet;
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  }, []);


//   useEffect(() => {
//     if (curRow >0){
//       checkGameState();
//     }
//   }, [curRow]);

  useEffect(() => {
    if (loaded) {   
       persistState();
      }
  }, [rows, curRow, curCol, gameState]);

  useEffect(() => {
    readState();
  }, []);

const persistState = async () => {

  const dataForToday = {
    rows, curRow, curCol, gameState, dayLetters
  };
  try {
    const existingStateString = await AsyncStorage.getItem('@game');
    const existingState =  existingStateString ? JSON.parse(existingStateString) : {};

    existingState[dayKey] = dataForToday;
    const dataString = JSON.stringify(existingState);
    console.log('Saving', dataString);
    await AsyncStorage.setItem('@game', dataString);
  } catch (e) {
  console.log('Failed to write data to async storage', dayKey);
}};

const readState = async () => {
  const dataString = await AsyncStorage.getItem('@game');
  try {
    const data = JSON.parse(dataString);
    const day = data[dayKey];
    setRows(day.rows);
    setCurCol(day.curCol);
    setCurRow(day.curRow);
    setGameState(day.gameState);
    setDayLetters(day.dayLetters);
  } catch (e) {
    console.log('Could not parse the state');
  }
  setLoaded(true)
}

//   const checkGameState = () => {
//     if (checkIfWon() && gameState !== 'won') {
//       Alert.alert('Yay', 'You won!', [{ text: 'Share', onPress: shareScore() }] );
//       setGameState('won');
//     } else if (checkIfLost() &&gameState !== 'lost' ){
//       Alert.alert('Darn', 'Try Again tomorrow.');
//       setGameState('lost');
//     }
//   }

  const shareScore = () => {
    const textMap = rows.map((row,i) =>
    row.map((cell, j) => colorsToEmoji[getCellBGColor(i,j)] ).join('')
    ).filter((row) => row)
    .join('\n');
    const textToShare = `Wordle Copy \n ${textMap}`;
    Clipboard.setString(textToShare)
    Alert.alert('Copied to your clipboard', 'Paste to share to social media')
  }

//   const amDone = () => {
//     console.log("Done")
//     return;
//   }

//   const checkIfWon = () => {
//     const row = rows[curRow - 1];
//     return row.every((letter, i) => letter === letters[i])
//   }

//   const checkIfLost = () => {
//     return !checkIfWon() && curRow ===rows.length;
//   }

  const checkWord = (rowWord) => {
    if (words.includes(rowWord)){
        for (let i = 0; i<= rowWord.length; i++){
            var x = 1;
            if (i+curCol%8==0){
                x = 2;
            }
            if (rowWord[i] == letters[0] ||
                rowWord[i] == letters[2] ||
                rowWord[i] == letters[2] ||
                rowWord[i] == letters[3] ) {
                score = score + (1 * x);
                console.log(rowWord[i], i, score);
                }
            else if ( rowWord[i] == letters[4]) {
                score = score + (2 * x);
                console.log(rowWord[i], i, score);
            }
            else if (rowWord[i] == letters[5]) {
                score = score + (3 * x);
                console.log(rowWord[i], i, score);
            }
            else if (rowWord[i] == letters[6]) {
                score = score + (4 * x);
                console.log(rowWord[i], i, score);
            }
            else if (rowWord[i] == letters[7]) {
                score = score + (5 * x);
                console.log(rowWord[i], i, score);
            }
            else if (rowWord[i] == letters[8]) {
                score = score + (6 * x);
                console.log(rowWord[i], i, score);
            }
            else if (rowWord[i] == letters[9]) {
                score = score + (6 * x);
                console.log(rowWord[i], i, score);
            }

        }
        if (rowWord.length == 6){
            score = score *2
        }
        setShowScore(score + showScore);
        console.log("Booty");
        return true;
    }

  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing'){
      return;
    }
    const updatedRows = copyArray(rows);

    if (key === CLEAR){
      const prevCol = curCol - 1;
      if (prevCol >=0){
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === "↑"){
        setCurRow(curRow - 1);
        return;
      }    

      if (key === "↓"){
        setCurRow(curRow + 1);
        return;
      }    

    if (key === ENTER) {
        const rowWord = rows[curRow].toString().replace(/,/g,"");
        checkWord(rowWord);
        setCurRow(curRow + 1);
        setCurCol(0);
        return;
    }

    if (curCol <rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol +1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }

  const bonusCell = (row, col) => {
      return (row+col)%8!=0
  }

//   const getCellBGColor = (row, col) => {
//     const letter = rows[row][col];
//     if (row >= curRow){
//       return colors.black;
//     }
//     if (letter === letters[col]) {
//       return colors.primary;
//     }
//     if (letters.includes(letter)){
//       return colors.secondary;
//     }
//     return colors.darkgrey
//   };

//   const greenCaps = rows.flatMap((row, i) =>
//     row.filter((cell, j) => getCellBGColor(i,j) === colors.primary)
//   );
//   const yellowCaps = rows.flatMap((row, i) =>
//     row.filter((cell, j) => getCellBGColor(i,j) === colors.secondary)
//   );
//   const greyCaps = rows.flatMap((row, i) =>
//     row.filter((cell, j) => getCellBGColor(i,j) === colors.darkgrey)
//   );
  const greyCaps = setGreyCaps();

  if (!loaded){
    return (<ActivityIndicator />)
  }

  if (gameState != 'playing'){
    console.log("BurgerKing");
    return (<FinalPage won={gameState === 'won'} />)
  }

  return (
      <>
      <View style ={{display: 'inline-block'}} >
        <Text style={{color: colors.lightgrey }}>Timer: {timerCount}</Text>
        <Text style={{color: colors.lightgrey }}>Score: {showScore}</Text>
      </View>
      <View style={styles.map}> 
      
        {rows.map((row, i) => 
          <View key={`row-${i}`} style ={styles.row}>
          {row.map((letter, j) => (
              <View key={`cell-${i}-${j}`} 
              style={[styles.cell, {borderColor: isCellActive(i,j)
                ? colors.grey
                : colors.darkgrey,
                backgroundColor: bonusCell(i,j)
                ? colors.black
                : '#661538',
                },
                ]}>
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>

          ))}
        {/* <Pressable onPress={amDone} style={styles.amDone}>
            <Text style={styles.amDoneButton}>Finish</Text>
        </Pressable> */}
        </View>
    
        )}


      <Keyboard onKeyPressed={onKeyPressed} 
    //   greenCaps={greenCaps}
    //   yellowCaps={yellowCaps}
      greyCaps={greyCaps}
      />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    map: {
      alignSelf: 'stretch',
      height: 560,
    },
    row: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'center',
  
    },
    cell:{
      borderWidth: 3,
      borderColor: colors.darkgrey,
      flex: 1,
      maxWidth: 60,
      aspectRatio: 1,
      margin:5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellText: {
      color: colors.lightgrey,
      fontSize: 26,
      fontWeight: 'bold',
    },
    amDone: { 
        flex: 1, 
        backgroundColor: colors.magenta,
        borderRadius: 25, 
        alignItems: 'center',  
        justifyContent: 'center' 
    },
    amDoneButton: { 
        color: colors.lightgrey, 
        fontWeight: 'bold' 
    },
  });

export default Game;
