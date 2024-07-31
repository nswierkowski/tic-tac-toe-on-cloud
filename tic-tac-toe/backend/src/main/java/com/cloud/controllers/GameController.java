package com.cloud.controllers;

import com.cloud.controllers.dto.ConnectRequest;
import com.cloud.exception.InvalidGameException;
import com.cloud.exception.NotFoundException;
import com.cloud.model.Game;
import com.cloud.model.GamePlay;
import com.cloud.model.Player;
import com.cloud.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player) {
        log.info("Start game request {}.", player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws InvalidGameException {
        log.info("Connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(
                request.getPlayer(),
                request.getGameId()
        ));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player) throws NotFoundException {
        log.info("Connect random: {}", player);
        return ResponseEntity.ok(
                gameService.connectToRandomGame(player)
        );
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gamePlay(@RequestBody GamePlay request) throws InvalidGameException, NotFoundException {
        log.info("Gameplay: {}", request);
        var game = gameService.gamePlay(request);
        simpMessagingTemplate.convertAndSend(
                String.format("/topic/game-progress/%s", game.getGameId()),
                game);
        return ResponseEntity.ok(game);
    }
}
