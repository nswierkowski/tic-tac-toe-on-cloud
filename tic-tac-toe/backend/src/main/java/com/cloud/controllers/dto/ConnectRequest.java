package com.cloud.controllers.dto;

import com.cloud.model.Player;
import lombok.Data;

@Data
public class ConnectRequest {

    private Player player;
    private String gameId;
}
