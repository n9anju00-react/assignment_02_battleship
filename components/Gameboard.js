import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Entypo from "@expo/vector-icons/Entypo";
import styles from '../style/style';

const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';
const NBR_OF_COLS = 5;
const NBR_OF_ROWS = 5;
const NBR_OF_BOMBS = 15;
const NBR_OF_SHIPS = 3;
const TIMER = 30;
let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);


export default function Gameboard() {
  const [board, setBoard] = useState(initialBoard);
  const [shipPositions, setShipPositions] = useState([]);
  const [hits, setHits] = useState(0);
  const [nrbOfBombsLeft, setNrbOfBombsLeft] = useState(NBR_OF_BOMBS);
  const [nbrOfShipsLeft, setNbrOfShipsLeft] = useState(NBR_OF_SHIPS);
  const [button, setButton] = useState('Start game');
  const [status, setStatus] = useState('Game has not started');
  const [time, setTime] = useState(TIMER);
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    if (nbrOfShipsLeft === 0) {
      setStatus('You sinked all ships.');
      setIsActive(false);
    }
    if (nrbOfBombsLeft === 0) {
      // jos sattuukin viimeisellä pommilla voittamaan pelin
      if (nbrOfShipsLeft === 0) {
        setStatus('You sinked all ships.');
        setIsActive(false);
      }
      else {
        setStatus('Game over. Ships remaining.');
        setIsActive(false);
      }
    }
    if (time === 0) {
      setStatus('Timeout. Ships remaining.');
      setIsActive(false);
    }
  }, [nbrOfShipsLeft, nrbOfBombsLeft, time]);
  
  // samassa useEffectissä edellisen kanssa ollessa timer lagaa, siksi omassa
  useEffect(() => {
    if (isActive) {
      const intervalId = setInterval(() => {
        time > 0 && setTime(prevCount => prevCount - 1);
      }, 1000);
      return (() => {
        clearInterval(intervalId);
      })
    }
  }, [isActive]);


  function startGame() {
    setHits(0);
    setNbrOfShipsLeft(NBR_OF_SHIPS);
    setNrbOfBombsLeft(NBR_OF_BOMBS);
    setTime(TIMER);
    let initialBoard = [...board];
    initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
    setBoard(initialBoard);
    spawnShips();
    setButton('New game');
    setStatus('Game is on...');
    setIsActive(true);
  }


  function spawnShips() {
    let shipPositions = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill('false');
    for (let i = 0; i < NBR_OF_SHIPS; i++) {
      let randomNumber = Math.floor(Math.random() * (NBR_OF_COLS * NBR_OF_ROWS));
      if (shipPositions[randomNumber] !== 'true') {
        shipPositions[randomNumber] = 'true';
      }
      else {
        let randomNumber2 = Math.floor(Math.random() * (NBR_OF_COLS * NBR_OF_ROWS));
        if (shipPositions[randomNumber2] !== 'true') {
          shipPositions[randomNumber2] = 'true';
        }
        else {
          let randomNumber3 = Math.floor(Math.random() * (NBR_OF_COLS * NBR_OF_ROWS));
          if (shipPositions[randomNumber3] !== 'true') {
            shipPositions[randomNumber3] = 'true';
          }
          else {
            let randomNumber4 = Math.floor(Math.random() * (NBR_OF_COLS * NBR_OF_ROWS));
            if (shipPositions[randomNumber4] !== 'true') {
              shipPositions[randomNumber4] = 'true';
            }
            else {
              let randomNumber5 = Math.floor(Math.random() * (NBR_OF_COLS * NBR_OF_ROWS));
              shipPositions[randomNumber5] = 'true';
            }
          }
        }
      }
    }
    setShipPositions([...shipPositions]);
  }


  function drawItem(number) {
    if (status === 'Game has not started' || status === 'Click the start button first...' ) {
      setStatus('Click the start button first...');
      return 0;
    }
    else if (!isActive) {
      return 0;
    }
    else {
      if (board[number] === START) {
        if (shipPositions[number] === 'true') {
          board[number] = CIRCLE;
          setNbrOfShipsLeft(nbrOfShipsLeft-1);
          setHits(hits+1);
        }
        else {
          board[number] = CROSS;
        }
        setNrbOfBombsLeft(nrbOfBombsLeft-1);
      }
    }
  }


  function chooseItemColor(number) {
    if (board[number] === CROSS) {
      return "#FF3031"
    }
    else if (board[number] === CIRCLE) {
      return "#45CE30"
    }
    else {
      return "#74B9FF"
    }
  }


  const items = [];
  for (let x = 0; x < NBR_OF_COLS; x++) {
    const cols = [];
    for (let y = 0; y < NBR_OF_ROWS; y++) {
      cols.push(
        <Pressable
          key={y * NBR_OF_ROWS + x}
          style={styles.item}
          onPress={() => drawItem(y * NBR_OF_ROWS + x)}>
          <Entypo 
            key={y * NBR_OF_ROWS + x}
            name={board[y * NBR_OF_ROWS + x]}
            size={24}
            color={chooseItemColor(y * NBR_OF_ROWS + x)} />
        </Pressable>
      );
    }
    let row =
      <View key={"row" + x}>
        {cols.map((item) => item)}
      </View>
    items.push(row);
  }
    
  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{items}</View>
      <Pressable style={styles.button} onPress={() => startGame()}>
        <Text style={styles.buttonText}>{button}</Text>
      </Pressable>
      <Text style={styles.gameinfo}>Hits: {hits} | Bombs: {nrbOfBombsLeft} | Ships: {nbrOfShipsLeft}</Text>
      <Text style={styles.gameinfo}>Time: {time} sec</Text>
      <Text style={styles.gameinfo}>Status: {status}</Text>
      <StatusBar style="auto" />
    </View>
  )
}