package com.cloud.model;

import com.cloud.storage.GameStorage;
import lombok.Getter;
import lombok.Setter;

@Getter
public final class Game {

    private final String gameId;
    private final Player playerOne;
    @Setter
    private Player playerTwo;
    @Setter
    private GameStatus gameStatus;
    private final int[][] board;
    @Setter
    private TicToe winner;

    public Game(String gameId, Player playerOne, Player playerTwo, GameStatus gameStatus, int[][] board) {
        this.gameId = gameId;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.gameStatus = gameStatus;
        this.board = board;

        GameStorage.getInstance().getGames().put(gameId, this);
    }
}
