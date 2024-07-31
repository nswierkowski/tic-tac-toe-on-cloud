package com.cloud.service;

import com.cloud.exception.InvalidGameException;
import com.cloud.exception.NotFoundException;
import com.cloud.model.*;
import com.cloud.storage.GameStorage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class GameService {

    public Game createGame(Player player) {
        var game = new Game(
                UUID.randomUUID().toString(),
                player,
                null,
                GameStatus.NEW,
                new int[3][3]
        );
        GameStorage.getInstance().addGame(game);
        return game;
    }


    public Game connectToGame(Player playerTwo, String gameId) throws InvalidGameException {
        if (!GameStorage.getInstance().getGames().containsKey(gameId)) {
            throw new IllegalArgumentException(
                    String.format("The game of ID %s does not exist", gameId)
            );
        }
        var game = GameStorage.getInstance().getGames().get(gameId);

        if (game.getPlayerTwo() != null) {
            throw new InvalidGameException(
                    String.format("The game of ID %s is not valid", gameId)
            );
        }
        game.setPlayerTwo(playerTwo);
        game.setGameStatus(GameStatus.IN_PROGRESS);
        GameStorage.getInstance().addGame(game);
        return game;
    }

    public Game connectToRandomGame(Player playerTwo) throws NotFoundException {
        log.warn("GAMES {}", GameStorage.getInstance().getGames());
        log.warn("STATUS: {}", GameStorage.getInstance().getGames());
        var optionalGame = GameStorage.getInstance()
                .getGames()
                .values()
                .stream()
                .filter(it -> it.getGameStatus() == GameStatus.NEW)
                .findFirst();

        if (optionalGame.isEmpty())
            throw new NotFoundException("Not found a game which status is NEW");

        var game = optionalGame.get();
        game.setPlayerTwo(playerTwo);
        game.setGameStatus(GameStatus.IN_PROGRESS);
        GameStorage.getInstance().addGame(game);
        return game;
    }

    public Game gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameException {
        if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
            throw new NotFoundException(
                    String.format("Game of ID: %s not found", gamePlay.getGameId())
            );
        }

        var game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());

        if (game.getGameStatus().equals(GameStatus.FINISHED)) {
            throw new InvalidGameException(
                    String.format("Game of ID: %s not found", gamePlay.getGameId())
            );
        }

        var board = game.getBoard();
        board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType().getValue();

        if (checkWinner(game.getBoard(), TicToe.X)) {
            game.setWinner(TicToe.X);
        } else if (checkWinner(game.getBoard(), TicToe.O)) {
            game.setWinner(TicToe.O);
        }

        GameStorage.getInstance().addGame(game);
        return game;
    }

    private Boolean checkWinner(int[][] board, TicToe ticToe) {
        var boardArray = new int[9];
        int counterIndex = 0;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board.length; j++) {
                boardArray[counterIndex] = board[i][j];
                counterIndex += 1;
            }
        }

        int[][] winCombinations = {
                {0, 1, 2},
                {3, 4, 5},
                {6, 7, 8},
                {0, 3, 6},
                {1, 4, 7},
                {2, 5, 8},
                {0, 4, 8},
                {2, 4, 6},
        };

        for (int i = 0; i < winCombinations.length; i++) {
            int counter = 0;
            for (int j = 0; j < winCombinations[i].length; j++) {
                if (boardArray[winCombinations[i][j]] == ticToe.getValue()) {
                    counter++;
                    if (counter == 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
