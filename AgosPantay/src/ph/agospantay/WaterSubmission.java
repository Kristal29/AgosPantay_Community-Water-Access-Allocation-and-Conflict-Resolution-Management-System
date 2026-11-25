package ph.agospantay;

import java.util.LinkedHashMap;
import java.util.Map;

/** Shared ownership, tracking information, and review status for a resident submission. */
public abstract class WaterSubmission implements Trackable{
    public static final String SUBMITTED = "Submitted";

    private final Long residentId;
    private final String title;
    private final String area;
    private String status;

    protected WaterSubmission(Long residentId, String title, String area) {
        this(residentId, title, area, SUBMITTED);
    }

    protected WaterSubmission(Long residentId, String title, String area, String status) {
        this.residentId = residentId;
        this.title = title;
        this.area = area;
        this.status = Input.choice(status, "Status", module().statuses);
    }

    public final Long getResidentId() {
        return this.residentId;
    }

    @Override
    public final String getTitle() {
        return this.title;
    }

    @Override
    public final String getArea() {
        return this.area;
    }

    @Override
    public final String getStatus() {
        return this.status;
    }

    public final void validateForSubmission() {
        Input.required(this.title, "Title", 120);
        this.validateDetails();
    }

    public final void updateStatus(String nextStatus) {
        this.status = Input.choice(nextStatus, "Status", module().statuses);
    }

    public final Map<String, Object> fields() {
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("title", this.title);
        fields.put("area", this.area);
        fields.put("status", this.status);
        fields.putAll(detailFields());
        return fields;
    }

    protected abstract void validateDetails();

    protected abstract Map<String, Object> detailFields();

    abstract CommunityModule module();
}

