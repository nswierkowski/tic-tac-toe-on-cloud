package com.cloud.exception;

import lombok.Getter;

public class NotFoundException extends Exception {

    @Getter
    private String message;

    public NotFoundException(String message) {
        this.message = message;
    }
}
