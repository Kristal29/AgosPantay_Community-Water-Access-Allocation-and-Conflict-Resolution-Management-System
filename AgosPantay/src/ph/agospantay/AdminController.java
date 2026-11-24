package ph.agospantay;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/admin")
class AdminController {
    private final AdminService admin;

    AdminController(AdminService admin) {
        this.admin = admin;
    }

    @GetMapping("/dashboard")
    Map<String, Object> dashboard() {
        return this.admin.dashboard();
    }

    @PostMapping("/records/{module}")
    @ResponseStatus(HttpStatus.CREATED)
    void add(@PathVariable String module, @RequestBody JsonNode body, Principal principal) {
        this.admin.add(module, body, principal.getName());
    }

    @PutMapping("/records/{module}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@PathVariable String module, @PathVariable long id, @RequestBody JsonNode body, Principal principal) {
        this.admin.update(module, id, body, principal.getName());
    }

    @DeleteMapping("/records/{module}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable String module, @PathVariable long id, Principal principal) {
        this.admin.delete(module, id, principal.getName());
    }

    @PutMapping("/settings")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void settings(@RequestBody JsonNode body, Principal principal) {
        this.admin.saveSettings(body, principal.getName());
    }
}

