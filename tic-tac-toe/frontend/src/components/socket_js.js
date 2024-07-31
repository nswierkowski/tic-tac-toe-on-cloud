import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import tryRefreshSessionToken from './cognito/Cognito';

const url = process.env.REACT_APP_API_URL;
console.log(`url = ${url}`)

const TicTacToeGame = () => {
  const [gameId, setGameId] = useState(null);
  const [playerType, setPlayerType] = useState('');
  const [turns, setTurns] = useState([["#", "#", "#"], ["#", "#", "#"], ["#", "#", "#"]]);
  const [gameOn, setGameOn] = useState(false);
  const [opponent, setOpponent] = useState('');
  let stompClient;

  useEffect(() => {
    if (gameId) {
      connectToSocket(gameId);
    }
  }, [gameId]);

  const connectToSocket = (gameId) => {
    console.log("connecting to the game");
    const socket = new SockJS(url + "/gameplay");
    stompClient = new Client({ webSocketFactory: () => socket });
    stompClient.activate();
    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe("/topic/game-progress/" + gameId, (response) => {
        const data = JSON.parse(response.body);
        console.log(data);
        displayResponse(data);
      });
    };
  };

  const createGame = async () => {
    const login = document.getElementById("login").value;
    if (!login) {
      alert("Please enter login");
    } else {

      await tryRefreshSessionToken();
      const token = localStorage.getItem("token");
      if (!token || token == null) {
        alert("You have to be correctly loged in to play a game!");
        return;
      }

      console.log(`Token: ${token}`); 

      fetch(url  + "/game/start", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "login": login
        })
      })
      .then(async response => {
        if (!response.ok) {
          // If the response is not OK, log the status and status text
          console.error(`Error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          throw new Error(`Server responded with an error: ${errorText}`);
        }
        return response.json();
      })
      .then(data => {
        setGameId(data.gameId);
        setPlayerType('X');
        reset();
        setGameOn(true);
        alert("You created a game. Game id is: " + data.gameId);
      })
      .catch(error => console.log(error));
    }
  };

  const connectToRandom = async () => {
    const login = document.getElementById("login").value;
    if (!login) {
      alert("Please enter login");
    } else {

      await tryRefreshSessionToken();
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You have to be correctly loged in to play a game!");
        return;
      }

      fetch(url + "/game/connect/random", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "login": login
        })
      })
      .then(response => response.json())
      .then(data => {
        setGameId(data.gameId);
        setPlayerType('O');
        setOpponent(data.player1.login);
        reset();
        setGameOn(true);
        alert("Congrats you're playing with: " + data.player1.login);
      })
      .catch(error => console.log(error));
    }
  };

  const playerTurn = (id) => {
    if (gameOn) {
      const xCoordinate = id.split("_")[0];
      const yCoordinate = id.split("_")[1];
      const spotTaken = turns[xCoordinate][yCoordinate];
      if (spotTaken === "#") {
        makeAMove(playerType, xCoordinate, yCoordinate);
      }
    }
  };

  const makeAMove = async (type, xCoordinate, yCoordinate) => {

    await tryRefreshSessionToken();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You have to be correctly loged in to play a game!");
      return;
    }

    fetch(url + "/game/gameplay", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "type": type,
        "coordinateX": xCoordinate,
        "coordinateY": yCoordinate,
        "gameId": gameId
      })
    })
    .then(response => response.json())
    .then(data => {
      setGameOn(false);
      displayResponse(data);
    })
    .catch(error => console.log(error));
  };

  const displayResponse = (data) => {
    const newTurns = [...turns];
    data.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) {
          newTurns[i][j] = 'X';
        } else if (cell === 2) {
          newTurns[i][j] = 'O';
        }
      });
    });
    setTurns(newTurns);
    if (data.winner) {
      alert("Winner is " + data.winner);
    }
    setGameOn(true);
  };

  const reset = () => {
    setTurns([["#", "#", "#"], ["#", "#", "#"], ["#", "#", "#"]]);
  };

  const assertUserLogedIn = () => {
    return localStorage.getItem('token'); 
  }

  return (
    <div>
      <input type="text" id="login" placeholder="Enter login" />
      <button disabled={!assertUserLogedIn()} onClick={createGame}>Create Game</button>
      <button disabled={!assertUserLogedIn()} onClick={connectToRandom}>Connect to Random Game</button>
      <ul id="gameBoard">
        {turns.map((row, i) => (
          row.map((cell, j) => (
            <li key={`${i}_${j}`} className="tic" id={`${i}_${j}`} onClick={() => playerTurn(`${i}_${j}`)}>
              {cell}
            </li>
          ))
        ))}
      </ul>
      <input id="game_id" placeholder="Paste game id"/>
      <button disabled={!assertUserLogedIn()} onClick={connectToSocket}>Connect by game id</button>
      <button disabled={!assertUserLogedIn()} onClick={reset}>Reset</button>
      <div id="message"></div>
      <div className="clearfix"></div>
      <footer>
          <span>You are playing with {opponent}</span>
          <br />
          <span>It's {gameOn ? 'your' : opponent}'s move</span>
      </footer>
    </div>
  );
};

export default TicTacToeGame;
