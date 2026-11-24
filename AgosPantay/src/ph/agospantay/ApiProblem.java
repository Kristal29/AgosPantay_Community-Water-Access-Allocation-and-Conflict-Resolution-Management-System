package ph.agospantay;

import org.springframework.http.HttpStatus;

final class ApiProblem extends RuntimeException {
    private final HttpStatus status;

    ApiProblem(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    HttpStatus status() {
        return this.status;
    }

    static ApiProblem badRequest(String message) {
        return new ApiProblem(HttpStatus.BAD_REQUEST, message);
    }

    static ApiProblem conflict(String message) {
        return new ApiProblem(HttpStatus.CONFLICT, message);
    }

    static ApiProblem notFound(String message) {
        return new ApiProblem(HttpStatus.NOT_FOUND, message);
    }
}

