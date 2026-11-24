package ph.agospantay;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Repository
class CommunityRepository {
    static final ZoneId COMMUNITY_ZONE = ZoneId.of("Asia/Manila");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("MMM d, uuuu", Locale.ENGLISH);
    private static final DateTimeFormatter AUDIT_TIME = DateTimeFormatter.ofPattern("MMM d, uuuu h:mm a", Locale.ENGLISH);
    private static final String ORDER = " ORDER BY created_at DESC, id DESC";
    private final JdbcClient jdbc;
    private final ObjectMapper json;

    record PortalSettings(String community, String barangay) {}
    record Activity(String time, String user, String action) {}
    record ReadReceipt(long id, int revision) {}

    CommunityRepository(JdbcClient jdbc, ObjectMapper json) {
        this.jdbc = jdbc;
        this.json = json;
    }

    List<ObjectNode> list(CommunityModule module) {
        return jdbc.sql("SELECT * FROM community_records WHERE module = ?" + ORDER)
            .param(module.key).query(this::readRecord).list();
    }

    List<ObjectNode> owned(CommunityModule module, long residentId) {
        return this.jdbc.sql("SELECT * FROM community_records WHERE module = ? AND resident_id = ?" + ORDER)
            .param(module.key).param(residentId).query(this::readRecord).list();
    }

    ObjectNode lock(CommunityModule module, long id) {
        return this.jdbc.sql("SELECT * FROM community_records WHERE module = ? AND id = ? FOR UPDATE")
            .param(module.key).param(id).query(this::readRecord).optional()
            .orElseThrow(() -> ApiProblem.notFound("This record could not be found. Refresh the list."));
    }

    long create(CommunityModule module, ObjectNode fields, Long residentId) {
        var keys = new GeneratedKeyHolder();
        this.jdbc.sql("INSERT INTO community_records (module, resident_id, payload) VALUES (?, ?, ?)")
            .param(1, module.key).param(2, residentId, Types.BIGINT).param(3, fields.toString()).update(keys, "ID");
        return Objects.requireNonNull(keys.getKey()).longValue();
    }

    void update(CommunityModule module, long id, ObjectNode fields) {
        // These values come from the table columns when records are read.
        fields.remove(List.of("id", "residentId", "date", "code", "createdAt", "updatedAt", "revision"));
        this.jdbc.sql("""
                UPDATE community_records
                SET payload = ?, updated_at = CURRENT_TIMESTAMP, revision = revision + 1
                WHERE module = ? AND id = ?
                """).param(fields.toString()).param(module.key).param(id).update();
    }

    void delete(CommunityModule module, long id) {
        this.jdbc.sql("DELETE FROM community_records WHERE module = ? AND id = ?")
            .param(module.key).param(id).update();
    }

    void audit(String actor, String action) {
        this.jdbc.sql("INSERT INTO activity_logs (actor, action) VALUES (?, ?)")
            .param(actor).param(action).update();
    }

    List<Activity> recentActivity() {
        return this.jdbc.sql("SELECT actor, action, recorded_at FROM activity_logs ORDER BY id DESC")
            .query((row, index) -> new Activity(
                AUDIT_TIME.format(row.getObject("recorded_at", OffsetDateTime.class).atZoneSameInstant(COMMUNITY_ZONE)),
                row.getString("actor"), row.getString("action"))).list();
    }

    PortalSettings settings() {
        return this.jdbc.sql("SELECT community, barangay FROM portal_settings WHERE id = 1")
            .query((row, index) -> new PortalSettings(row.getString("community"), row.getString("barangay")))
            .single();
    }

    void saveSettings(PortalSettings settings) {
        this.jdbc.sql("MERGE INTO portal_settings (id, community, barangay) KEY (id) VALUES (1, ?, ?)")
            .param(settings.community()).param(settings.barangay()).update();
    }

    List<ReadReceipt> readReceipts(long residentId) {
        return this.jdbc.sql("SELECT record_id, revision FROM resident_notification_reads WHERE resident_id = ?")
            .param(residentId).query((row, index) -> new ReadReceipt(row.getLong("record_id"), row.getInt("revision")))
            .list();
    }

    void markRead(long residentId, ReadReceipt receipt) {
        this.jdbc.sql("MERGE INTO resident_notification_reads (resident_id, record_id, revision) KEY (resident_id, record_id) VALUES (?, ?, ?)")
            .param(residentId).param(receipt.id()).param(receipt.revision()).update();
    }

    static String code(CommunityModule module, long id) {
        return switch (module) {
            case REPORTS -> "AGP-RPT-" + id;
            case REQUESTS -> "AGP-REQ-" + id;
            default -> "#" + id;
        };
    }

    private ObjectNode readRecord(ResultSet row, int index) throws SQLException {
        ObjectNode record;
        try {
            record = (ObjectNode) json.readTree(row.getString("payload"));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Saved record could not be read.", e);
        }
        long id = row.getLong("id");
        var module = CommunityModule.from(row.getString("module"));
        var created = row.getObject("created_at", OffsetDateTime.class);
        record.put("id", id);
        record.put("code", code(module, id));
        record.put("date", DATE.format(created.atZoneSameInstant(COMMUNITY_ZONE)));
        record.put("createdAt", created.toInstant().toString());
        record.put("updatedAt", row.getObject("updated_at", OffsetDateTime.class).toInstant().toString());
        record.put("revision", row.getInt("revision"));
        Long residentId = row.getObject("resident_id", Long.class);
        if (residentId != null) {
            record.put("residentId", residentId);
        }
        return record;
    }
}

