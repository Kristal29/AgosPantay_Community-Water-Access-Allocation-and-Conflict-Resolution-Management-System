package ph.agospantay;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping({"/api"})
class AuthController {
   private final AccountService accounts;

   AuthController(AccountService accounts) {
      this.accounts = accounts;
   }

   @GetMapping({"/csrf"})
   Map<String, String> csrf(CsrfToken csrf) {
      return Map.of("header", csrf.getHeaderName(), "token", csrf.getToken());
   }

   @PostMapping({"/register"})
   @ResponseStatus(HttpStatus.CREATED)
   Map<String, String> register(@RequestBody JsonNode registration) {
      this.accounts.register(registration);
      return Map.of("message", "Account created. Sign in with your new username and password.");
   }

   @GetMapping({"/session"})
   AccountService.Session session(Principal principal) {
      return this.accounts.session(principal.getName());
   }
}

