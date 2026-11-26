package ph.agospantay;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
class FirstRun implements ApplicationRunner {
    private static final String DEMO_ADMIN_PASSWORD = "admin 123";

    private final AccountService accounts;
    private final CommunityRepository community;
    private final ObjectMapper json;
    private final TransactionTemplate transactions;
    private final String configuredPassword;
    private final boolean seedSamples;

    FirstRun(AccountService accounts, CommunityRepository community, ObjectMapper json, TransactionTemplate transactions,
             @Value("${agospantay.admin-password}") String configuredPassword,
             @Value("${agospantay.seed-samples}") boolean seedSamples) {
        this.accounts = accounts;
        this.community = community;
        this.json = json;
        this.transactions = transactions;
        this.configuredPassword = configuredPassword;
        this.seedSamples = seedSamples;
    }

    @Override
    public void run(ApplicationArguments arguments) {
        String password = configuredPassword.isEmpty() ? DEMO_ADMIN_PASSWORD : configuredPassword;
        if (password.length() < 8 || password.length() > 128) {
            throw new IllegalArgumentException("Set AGOSPANTAY_ADMIN_PASSWORD to a password with 8–128 characters.");
        }

        transactions.executeWithoutResult(status -> {
            if (accounts.adminExists()) {
                if (!configuredPassword.isEmpty() && accounts.updateAdminPassword(password)) {
                    community.audit("admin", "Updated administrator password from startup configuration");
                }
                return;
            }
            accounts.createAdmin(password);
            community.saveSettings(new CommunityRepository.PortalSettings("AgosPantay", "Sorosoro Ilaya"));
            if (seedSamples) seed();
            community.audit("admin", "Initialized the AgosPantay database");
        });
        System.out.println("AgosPantay is ready. Open the Java server URL in your browser.");
    }

    private void seed() {
        var date = LocalDate.now(CommunityRepository.COMMUNITY_ZONE).plusDays(1);
        this.community.create(CommunityModule.ZONES, this.json.createObjectNode().put("community", "AgosPantay")
            .put("barangay", "Sorosoro Ilaya").put("zone", "Purok 1")
            .put("description", "Sample service area for the classroom demo."), null);
        this.community.create(CommunityModule.SOURCES, this.json.createObjectNode().put("title", "San Isidro Deep Well")
            .put("area", "Purok 1").put("status", "Normal").put("details", "Sample water source."), null);
        this.community.create(CommunityModule.SCHEDULES, this.json.createObjectNode().put("title", "Morning Water Distribution")
            .put("area", "Purok 1").put("status", "Scheduled").put("distributionDate", date.toString())
            .put("details", "Sample schedule. Bring clean water containers."), null);
        this.community.create(CommunityModule.ANNOUNCEMENTS, this.json.createObjectNode().put("title", "Welcome to AgosPantay")
            .put("area", "ALL").put("status", "Published")
            .put("details", "Complete My Profile to view the schedules and contacts for your purok."), null);
    }
}

