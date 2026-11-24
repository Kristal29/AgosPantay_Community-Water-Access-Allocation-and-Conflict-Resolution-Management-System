package ph.agospantay;

import java.util.Map;
import java.util.Set;

public final class WaterReport extends WaterSubmission {
    private static final Set<String> CATEGORIES = Set.of(
        "Weak Water Flow", "Pipe Damage / Leakage", "Water Quality", "Possible Contamination",
        "Delayed Distribution", "Unexpected Interruption", "Insufficient Supply", "Unequal Distribution", "Other Concern"
    );
    private static final Set<String> PRIORITIES = Set.of("Low", "Medium", "High", "Critical");

    private final String location;
    private final String details;
    private final String category;
    private final String priority;

    public WaterReport(Long residentId, String title, String area,
                       String location, String details, String category, String priority) {
        this(residentId, title, area, WaterSubmission.SUBMITTED, location, details, category, priority);
    }

    public WaterReport(Long residentId, String title, String area, String status,
                String location, String details, String category, String priority) {
        super(residentId, title, area, status);
        this.location = location;
        this.details = details;
        this.category = category;
        this.priority = priority;
    }

    public String getLocation() {
        return this.location;
    }

    public String getDetails() {
        return this.details;
    }

    public String getCategory() {
        return this.category;
    }

    public String getPriority() {
        return this.priority;
    }

    @Override
    protected void validateDetails() {
        Input.required(this.location, "Specific location", 160);
        Input.required(this.details, "Report details", 2000);
        Input.choice(this.category, "Report category", CATEGORIES);
        Input.choice(this.priority, "Urgency", PRIORITIES);
    }

    @Override
    protected Map<String, Object> detailFields() {
        return Map.of(
            "location", this.location, 
            "details", this.details, 
            "category", this.category, 
            "priority", this.priority
        );
    }

    @Override
    protected CommunityModule module() {
        return CommunityModule.REPORTS;
    }
}

