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
  const [row0Score, setRow0Score] = useState(0);
  const [row1Score, setRow1Score] = useState(0);
  const [row2Score, setRow2Score] = useState(0);
  const [row3Score, setRow3Score] = useState(0);
  const [row4Score, setRow4Score] = useState(0);
  const [row5Score, setRow5Score] = useState(0);
  const [showMaxScore, setShowMaxScore] = useState(0);
  let x = 1;
  let y = 1;
  let z = 1;
  let w = 1;
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
       setShowScore(row0Score + row1Score + row2Score + row3Score + row4Score + row5Score);
      }
  }, [rows, curRow, curCol, gameState]);

  useEffect(() => {
    readState();
    maxScore();
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

  const maxScore = () => {
      const found = [];
      const scoreArray = [];
      var maxScore0 = 0;
      var maxScore1 = 0;
      var maxScore2 = 0;
      var maxScore3 = 0;
      var maxScore4 = 0;
      var maxScore5 = 0;
      var temp = 0;
      let notMe = 0;
    for (let i = 0; i<words.length; i++){
        notMe = 0;
        let word1 = words[i].split("");
        for (let j = 0; j<word1.length; j ++ ){
            if (!letters.includes(word1[j])){
                notMe = 1;
                break;
            }
        }
        if (notMe == 0){
            if (!found.includes(words[i])){
                found.push(words[i])
            }
        }
    }
      console.log("finished word found loop", found.length, found[8])
      for (let i = 0; i<found.length; i++){
          for (let j = 0; j<found[i].length; j++){
            let x = 1;
            let y = 1;
            let z = 1;
            let w = 1;

              if (i==0){
                  x = 2;
              }
              if (i==3){
                  y = 2;
              }
              if (i==4){
                  z = 2;
              }
              if (i==5){
                  w = 2;
              }
            if (found[i][j] == letters[0] ||
                found[i][j] == letters[2] ||
                found[i][j] == letters[2] ||
                found[i][j]  == letters[3] ) {
                score = score + (1* x * y * z * w) ;
                }
            else if ( found[i][j]  == letters[4]) {
                score = score + (2* x * y * z * w) ;
            }
            else if (found[i][j]  == letters[5]) {
                score = score + (3* x * y * z * w) ;
            }
            else if (found[i][j]  == letters[6]) {
                score = score + (4* x * y * z * w) ;
            }
            else if (found[i][j]  == letters[7]) {
                score = score + (5* x * y * z * w) ;
            }
            else if (found[i][j]  == letters[8]) {
                score = score + (6* x * y * z * w) ;
                
            }
            else if (found[i][j]  == letters[9]) {
                score = score + (6* x * y * z * w) ;
            }
            
        }
        if (found.length >5){
            score = score *2
        }

        if (x=2){
            if (score> maxScore0){
                maxScore0 = score;
            }
        }
        else if (y=2){
            if (score> maxScore3){
                maxScore3 = score;
            }
        }
        else if (z=2){
            if (score> maxScore4){
                maxScore4 = score;
            }
        }
        else if (w=2){
            if (score> maxScore5){
                maxScore5 = score;
            }
        }
        else if (score > maxScore2){
            temp = maxScore2
            maxScore2 = score;
            if (maxScore2 > maxScore1){
                maxScore1 = maxScore2;
                maxScore2 = temp;
            }
        }
        console.log("score", score, maxScore0, maxScore3,x, y,z,w)
        score = 0;
        
      }
      setShowMaxScore(maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5);
  }



  const checkWord = (rowWord) => {
    if (words.includes(rowWord)){
        for (let i = 0; i< rowWord.length; i++){
            var x = 1;
            console.log("i: ", i, "curRow: ", curRow)
            if (curRow==0 && i == 0 || 
                curRow==3 && i == 5 ||
                curRow==4 && i == 4 ||
                curRow==5 && i == 3 ){
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
        if (curRow == 0){
            setRow0Score(score);
        } else if (curRow == 1)
            {setRow1Score(score)
        } else if (curRow == 2)
            {setRow2Score(score);
        } else if (curRow == 3)
            {setRow3Score(score);
        } else if (curRow == 4)
            { setRow4Score(score);
        } else if (curRow == 5)
            { setRow5Score(score);
        } 
        score = 0;
        setShowScore(row0Score + row1Score + row2Score + row3Score + row4Score + row5Score);
        return true;
    } else {
        Alert.alert(`${rowWord} is not a word`, 'Try again');
        return;
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
        for (let i = 0; i< curRow; i ++){
            if (rowWord == rows[i].toString().replace(/,/g,"")){
                setCurCol(0);
                Alert.alert('Same Word Used', `In Row ${i+1}`)
                return;
            }
        }
        checkWord(rowWord);
        setCurCol(0);
        if (curRow<6){
            setCurRow(curRow + 1);
        }
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
      <View style ={{ flexDirection: 'row' }} >
        <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18}}>Timer: {timerCount}</Text>
        <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18}}>Max: {showMaxScore}</Text>
        <Text style={{width: '30%', color: colors.lightgrey, fontSize: 18 }}>Score: {showScore}</Text>
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
