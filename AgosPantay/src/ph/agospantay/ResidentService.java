package ph.agospantay;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
class ResidentService {
    private static final Pattern AREA_LIST = Pattern.compile("[,;&/]|\\band\\b");

    record Dashboard(
        ResidentProfile profile,
        CommunityRepository.PortalSettings settings,
        List<ObjectNode> schedules,
        List<ObjectNode> announcements,
        List<ObjectNode> sources,
        List<ObjectNode> personnel,
        List<ObjectNode> reports,
        List<ObjectNode> requests,
        List<String> readNotifications
    ) {}

    record Submission(long id, String code, String status) {}

    private final AccountService accounts;
    private final ResidentRepository residents;
    private final CommunityRepository community;
    private final ObjectMapper json;

    ResidentService(AccountService accounts, ResidentRepository residents, CommunityRepository community, ObjectMapper json) {
        this.accounts = accounts;
        this.residents = residents;
        this.community = community;
        this.json = json;
    }

    @Transactional(readOnly = true)
    public Dashboard dashboard(String username) {
        return this.dashboard(this.accounts.resident(username, false));
    }

    @Transactional
    public void updateProfile(String username, JsonNode body) {
        ResidentProfile profile = this.accounts.resident(username, true);
        String name = Input.required(body, "name", "Full name", 100);
        String contact = Input.required(body, "contact", "Contact number", 20);
        if (!contact.matches("[+0-9 ()-]{7,20}") || contact.chars().noneMatch(Character::isDigit)) {
            throw ApiProblem.badRequest("Enter a contact number with 7–20 characters.");
        }
        String address = Input.required(body, "address", "Barangay", 100);
        String area = Input.required(body, "area", "Purok or zone", 100);
        this.residents.update(profile.id(), name, contact, address, area, profile.status());
        this.community.audit(username, "Updated resident profile");
    }

    @Transactional
    public Submission report(String username, JsonNode body) {
        ResidentProfile profile = this.submissionProfile(username);
        return this.submit(SubmissionRecords.report(profile, body), username);
    }

    @Transactional
    public Submission waterRequest(String username, JsonNode body) {
        ResidentProfile profile = this.submissionProfile(username);
        return this.submit(SubmissionRecords.request(profile, body), username);
    }

    @Transactional
    public void markRead(String username, List<CommunityRepository.ReadReceipt> receipts) {
        ResidentProfile profile = this.accounts.resident(username, true);
        Dashboard view = this.dashboard(profile);
        Map<Long, Integer> visible = Stream.of(view.announcements(), view.reports(), view.requests())
            .flatMap(List::stream)
            .collect(Collectors.toMap(record -> record.path("id").asLong(), record -> record.path("revision").asInt()));
        for (var receipt : receipts) {
            if (receipt != null && Objects.equals(visible.get(receipt.id()), receipt.revision())) {
                this.community.markRead(profile.id(), receipt);
            }
        }
    }

    private Dashboard dashboard(ResidentProfile profile) {
        String area = profile.area();
        return new Dashboard(
            profile,
            this.community.settings(),
            this.areaRecords(CommunityModule.SCHEDULES, area),
            this.areaRecords(CommunityModule.ANNOUNCEMENTS, area).stream()
                .filter(item -> "Published".equals(item.path("status").asText())).toList(),
            this.areaRecords(CommunityModule.SOURCES, area),
            this.areaRecords(CommunityModule.PERSONNEL, area).stream()
                .filter(item -> "Active".equals(item.path("status").asText())).toList(),
            this.community.owned(CommunityModule.REPORTS, profile.id()),
            this.community.owned(CommunityModule.REQUESTS, profile.id()),
            this.community.readReceipts(profile.id()).stream().map(receipt -> receipt.id() + ":" + receipt.revision()).toList()
        );
    }

    private ResidentProfile submissionProfile(String username) {
        ResidentProfile profile = this.accounts.resident(username, true);
        if (!profile.complete()) {
            throw ApiProblem.badRequest("Complete your barangay and purok in My Profile before submitting.");
        }
        return profile;
    }

    private Submission submit(WaterSubmission submission, String username) {
        submission.validateForSubmission();
        CommunityModule module = submission.module();
        ObjectNode fields = json.valueToTree(submission.fields());
        long id = this.community.create(module, fields, submission.getResidentId());
        this.community.audit(username, "Submitted a " + module.description + ": " + submission.getTitle());
        return new Submission(id, CommunityRepository.code(module, id), submission.getStatus());
    }

    private List<ObjectNode> areaRecords(CommunityModule module, String area) {
        return this.community.list(module).stream().filter(record -> this.areaMatches(record.path("area").asText(), area)).toList();
    }

    private boolean areaMatches(String serviceArea, String residentArea) {
        String scope = this.normalized(serviceArea);
        if ("all".equals(scope) || "all areas".equals(scope) || "community-wide".equals(scope)) return true;
        String ownArea = this.normalized(residentArea);
        if (ownArea.isEmpty() || scope.isEmpty()) return false;
        if (scope.equals(ownArea)) return true;

        String prefix = scope.startsWith("purok ") ? "purok " : scope.startsWith("zone ") ? "zone " : "";
        for (String part : AREA_LIST.split(scope)) {
            String item = part.strip();
            if (item.equals(ownArea) || (!prefix.isEmpty() && item.matches("[0-9]+") && (prefix + item).equals(ownArea))) {
                return true;
            }
        }
        return false;
    }

    private String normalized(String value) {
        return value.strip().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    }
}

