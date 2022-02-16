import { useEffect, useState, Pressable } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, Button  } from 'react-native';
import { colorsToEmoji, colors, CLEAR, ENTER } from '../../constants';;
import Keyboard from '../Keyboard';
import * as Clipboard  from 'expo-clipboard';
import { copyArray, getDayOfYear, getDayOfYearKey } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '../../utils/words';
import FinalPage from './FinalPage';

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
  const [highScores, setHighScores] = useState([]);
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
    const textToShare = `Six(S) ${showScore} / ${showMaxScore} \n ${textMap} \n Time left: ${timerCount}`;
    Clipboard.setString(textToShare)
    Alert.alert('Copied to your clipboard', 'Paste to share to social media')
  }


const scoreRow = (word, row) => {
    for (let i = 0; i< word.length; i++){
        var x = 1;
        if (row==0 && i == 0 || 
            row==3 && i == 5 ||
            row==4 && i == 4 ||
            row==5 && i == 3 ){
            x = 2;
        }
        if (word[i] == letters[0] ||
            word[i] == letters[2] ||
            word[i] == letters[2] ||
            word[i] == letters[3] ) {
            score = score + (1 * x);
            // console.log(word[i], i, score);
            }
        else if ( word[i] == letters[4]) {
            score = score + (2 * x);
            // console.log(word[i], i, score);
        }
        else if (word[i] == letters[5]) {
            score = score + (3 * x);
            // console.log(word[i], i, score);
        }
        else if (word[i] == letters[6]) {
            score = score + (4 * x);
            // console.log(word[i], i, score);
        }
        else if (word[i] == letters[7]) {
            score = score + (5 * x);
            // console.log(word[i], i, score);
        }
        else if (word[i] == letters[8]) {
            score = score + (6 * x);
            // console.log(word[i], i, score);
        }
        else if (word[i] == letters[9]) {
            score = score + (6 * x);
            // console.log(word[i], i, score);
        }
    }
    if (word.length == 6){
        score = score *2
    }
    return score;
}

  const maxScore = () => {
    const updatedHighScores = copyArray(highScores);
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
    for (let i = 0; i<10678; i++){
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
        for (let j=0; j<6; j++){
        scoreRow(found[i],j)

        if (j==0){
            if (score> maxScore0){
                maxScore0 = score;
                updatedHighScores[0]=found[i];
            }
        }
        else if (j==3){
            if (score> maxScore3){
                maxScore3 = score;
                updatedHighScores[3]=found[i];
                console.log(found[i]);
            }
        }
        else if (j==4){
            if (score> maxScore4){
                maxScore4 = score;
                updatedHighScores[4]=found[i];
            }
        }
        else if (j==5){
            if (score> maxScore5){
                maxScore5 = score;
                updatedHighScores[5]=found[i];
            }
        }
        else if (score > maxScore2){
            temp = maxScore2;
            maxScore2 = score;
            updatedHighScores[2] = found[i]
            if (maxScore1 < score && maxScore1 < temp){
                maxScore2 = score;
                updatedHighScores[1]=found[i];
            }
            console.log("Hope 1 isn't 0",maxScore2, maxScore1)
        }
        score = 0;
        setHighScores(updatedHighScores);
        } 
    }
      setShowMaxScore(maxScore0 + maxScore1 + maxScore2 + maxScore3 + maxScore4 + maxScore5);
      console.log(highScores[0],highScores[1],highScores[2],highScores[3],highScores[4],highScores[5]);
  }

  const checkWord = (rowWord) => {
    const updatedRows = copyArray(rows);
    if (words.includes(rowWord)){
       scoreRow(rowWord, curRow)
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
        console.log(curRow, curCol),
        updatedRows[curRow][curCol - 1] = '';
        updatedRows[curRow][curCol - 2] = '';
        updatedRows[curRow][curCol - 3] = '';
        updatedRows[curRow][curCol - 4] = '';
        updatedRows[curRow][curCol - 5] = '';
        updatedRows[curRow][curCol - 6] = '';
        setRows(updatedRows);
        console.log("cursor should be here: ",curRow)
        setCurRow(curRow);
        setCurCol(0);
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
        if (curRow > 0){
            setCurRow(curRow - 1);
        } else {
            setCurRow(curRow);
            setCurCol(curCol);
        }
        return;
      }    
      if (key === "↓"){
          if (curRow < 5){
            setCurRow(curRow + 1);
          }
        return;
      }    

    if (key === ENTER) {
        const rowWord = rows[curRow].toString().replace(/,/g,"");
        for (let i = 0; i< 6; i ++){
            if (rowWord == rows[i].toString().replace(/,/g,"") && curRow != i){
                console.log("curRow", curRow, i)
                updatedRows[curRow][curCol - 1] = '';
                updatedRows[curRow][curCol - 2] = '';
                updatedRows[curRow][curCol - 3] = '';
                updatedRows[curRow][curCol - 4] = '';
                updatedRows[curRow][curCol - 5] = '';
                updatedRows[curRow][curCol - 6] = '';
                setRows(updatedRows);
                setCurCol(0);
                Alert.alert('Same Word Used', `In Row ${i+1}`)
                return;
            }
        }
        if (curRow<6){
            setCurRow(curRow + 1);
        }
        checkWord(rowWord);
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

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row === 1 || row === 2){
        return;
    }
    if (row >= curRow){
      return colors.darkgrey;
    }
    if (row === 0 && col === 0) {
      return colors.magenta;
    }
    if (row === 3 && col === 5) {
        return colors.magenta;
      }
      if (row === 4 && col === 4) {
        return colors.magenta;
      }
      if (row === 5 && col === 3) {
        return colors.magenta;
      }

    return colors.darkgrey
  };

  const greyCaps = setGreyCaps();

  if (!loaded){
    return (<ActivityIndicator />)
  }

  if (gameState != 'playing'){
    console.log("BurgerKing");
    return (<FinalPage won={gameState === 'won'} />)
  }

  const amDone = () => {
    console.log("Done");
    setGameState('won');
    shareScore();
    return;
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

        </View>
    
        )}


      <Keyboard onKeyPressed={onKeyPressed} 
    //   greenCaps={greenCaps}
    //   yellowCaps={yellowCaps}
      greyCaps={greyCaps}
      
      />
    <Button style={styles.amDoneButton} onPress={amDone} 
        title = "I am Done.">
    </Button>
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
    amDoneButton: { 
        flex: 1, 
        color: colors.magenta,
        backgroundColor: colors.lightgrey,
        borderRadius: 25, 
        alignItems: 'center',  
        justifyContent: 'center' 
    },
  });

export default Game;
