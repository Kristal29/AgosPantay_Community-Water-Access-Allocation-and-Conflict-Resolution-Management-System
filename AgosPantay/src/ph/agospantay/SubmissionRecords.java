package ph.agospantay;

import com.fasterxml.jackson.databind.JsonNode;

/** Reads the API and database representations of the two submission types. */
public final class SubmissionRecords {
    private SubmissionRecords() {
    }

    public static WaterReport report(ResidentProfile profile, JsonNode body) {
        return new WaterReport(
            profile.id(), 
            Input.text(body, "title", "Short description"), 
            profile.area(),
            WaterSubmission.SUBMITTED, 
            Input.text(body, "location", "Specific location"),
            Input.text(body, "details", "Report details"), 
            Input.text(body, "category", "Report category"),
            Input.text(body, "priority", "Urgency")
        );
    }

    public static WaterRequest request(ResidentProfile profile, JsonNode body) {
        return new WaterRequest(
            profile.id(), 
            Input.text(body, "title", "Request summary"), 
            profile.area(),
            WaterSubmission.SUBMITTED, 
            Input.wholeNumber(body, "quantity", "Requested liters"),
            Input.wholeNumber(body, "householdSize", "Household members"), Input.text(body, "reason", "Reason"));
    }

    public static WaterSubmission forReview(CommunityModule module, JsonNode saved) {
        Long residentId = saved.hasNonNull("residentId") ? saved.path("residentId").longValue() : null;
        String title = saved.path("title").asText();
        String area = saved.path("area").asText();
        String status = saved.path("status").asText();

        // Admin-created entries can have fewer details. Reviewing them only changes allowed status and notes.
        return switch (module) {
            case REPORTS -> new WaterReport(
                residentId, title, area, status, 
                saved.path("location").asText(),
                saved.path("details").asText(), 
                saved.path("category").asText(), 
                saved.path("priority").asText()
            );
            case REQUESTS -> new WaterRequest(
                residentId, title, area, status, 
                saved.path("quantity").asInt(),
                saved.path("householdSize").asInt(), 
                saved.path("reason").asText()
            );
            default -> throw new IllegalArgumentException("Expected a water report or water request.");
        };
    }
}

