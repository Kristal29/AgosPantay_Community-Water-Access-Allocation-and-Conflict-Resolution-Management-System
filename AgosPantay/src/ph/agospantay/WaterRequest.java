package ph.agospantay;

import java.util.Map;

public final class WaterRequest extends WaterSubmission {
    private final int quantity;
    private final int householdSize;
    private final String reason;

    public WaterRequest(Long residentId, String title, String area,
                        int quantity, int householdSize, String reason) {
        this(residentId, title, area, WaterSubmission.SUBMITTED, quantity, householdSize, reason);
    }

    public WaterRequest(Long residentId, String title, String area, String status, int quantity, int householdSize, String reason) {
        super(residentId, title, area, status);
        this.quantity = quantity;
        this.householdSize = householdSize;
        this.reason = reason;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public int getHouseholdSize() {
        return this.householdSize;
    }

    public String getReason() {
        return this.reason;
    }

    @Override
    protected void validateDetails() {
        Input.requireRange(this.quantity, "Requested liters", 1, 100000);
        Input.requireRange(this.householdSize, "Household members", 1, 100);
        Input.required(this.reason, "Reason", 2000);
    }

    @Override
    protected Map<String, Object> detailFields() {
        String details = this.quantity + " liters for " + this.householdSize + " household member(s). " + reason;
        return Map.of("quantity", this.quantity, "householdSize", this.householdSize, "reason", this.reason, "details", details);
    }

    @Override
    protected CommunityModule module() {
        return CommunityModule.REQUESTS;
    }
}

