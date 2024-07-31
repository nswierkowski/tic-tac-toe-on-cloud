package com.cloud.storage;

import com.cloud.model.Game;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class GameStorage {

    @Getter
    private static Map<String, Game> games;
    private static GameStorage instance;

    private GameStorage() {
        games = new HashMap();
    }

    public static synchronized GameStorage getInstance() {
        if (instance == null) {
            instance = new GameStorage();
        }
        return instance;
    }

    public static void addGame(Game game) {
        log.info("GAME ADDED: {}", game.getGameId());
        games.put(game.getGameId(), game);
    }
}
