package ph.agospantay;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api")
class ResidentController {
    private final ResidentService residents;

    ResidentController(ResidentService residents) {
        this.residents = residents;
    }

    @GetMapping("/resident/dashboard")
    ResidentService.Dashboard dashboard(Principal principal) {
        return this.residents.dashboard(principal.getName());
    }

    @PutMapping("/resident/profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void profile(@RequestBody JsonNode body, Principal principal) {
        this.residents.updateProfile(principal.getName(), body);
    }

    @PostMapping("/reports")
    @ResponseStatus(HttpStatus.CREATED)
    ResidentService.Submission report(@RequestBody JsonNode body, Principal principal) {
        return this.residents.report(principal.getName(), body);
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    ResidentService.Submission waterRequest(@RequestBody JsonNode body, Principal principal) {
        return this.residents.waterRequest(principal.getName(), body);
    }

    @PostMapping("/resident/notifications/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void notifications(@RequestBody List<CommunityRepository.ReadReceipt> receipts, Principal principal) {
        this.residents.markRead(principal.getName(), receipts);
    }
}

