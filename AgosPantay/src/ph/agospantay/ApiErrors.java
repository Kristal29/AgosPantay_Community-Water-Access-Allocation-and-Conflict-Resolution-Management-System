package ph.agospantay;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
class ApiErrors {
   ApiErrors() {
   }

   @ExceptionHandler({ApiProblem.class})
   ResponseEntity<Map<String, String>> handle(ApiProblem problem) {
      return ResponseEntity.status(problem.status()).body(Map.of("message", problem.getMessage()));
   }

   @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
   ResponseEntity<Map<String, String>> malformedRequest() {
      return ResponseEntity.badRequest().body(Map.of("message", "The request contains an invalid value."));
   }
}

