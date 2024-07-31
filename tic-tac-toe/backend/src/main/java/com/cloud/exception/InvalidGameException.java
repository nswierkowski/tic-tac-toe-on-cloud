package com.cloud.exception;

import lombok.Getter;

public final class InvalidGameException extends Exception{

    @Getter
    private String message;

    public InvalidGameException(String message) {
        this.message = message;
    }
}
