package ph.agospantay;

import java.util.List;
import java.util.Objects;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

@Repository
class ResidentRepository {
    private static final RowMapper<ResidentProfile> PROFILE = (row, index) -> new ResidentProfile(
        row.getLong("id"), row.getString("name"), row.getString("contact"),
        row.getString("address"), row.getString("area"), row.getString("status")
    );

    private final JdbcClient jdbc;

    ResidentRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    ResidentProfile get(long id) {
        return this.find(id, false);
    }

    ResidentProfile lock(long id) {
        return this.find(id, true);
    }

    private ResidentProfile find(long id, boolean forUpdate) {
        String query = "SELECT * FROM residents WHERE id = ?" + (forUpdate ? " FOR UPDATE" : "");
        return this.jdbc.sql(query).param(id).query(PROFILE).optional()
            .orElseThrow(() -> ApiProblem.notFound("Resident profile not found."));
    }

    List<ResidentProfile> all() {
        return this.jdbc.sql("SELECT * FROM residents ORDER BY id DESC").query(PROFILE).list();
    }

    ResidentProfile create(String name, String contact, String address, String area, String status) {
        var keys = new GeneratedKeyHolder();
        this.jdbc.sql("INSERT INTO residents (name, contact, address, area, status) VALUES (?, ?, ?, ?, ?)")
            .param(name).param(contact).param(address).param(area).param(status).update(keys, "ID");
        return this.get(Objects.requireNonNull(keys.getKey()).longValue());
    }

    ResidentProfile update(long id, String name, String contact, String address, String area, String status) {
        this.jdbc.sql("UPDATE residents SET name = ?, contact = ?, address = ?, area = ?, status = ? WHERE id = ?")
            .param(name).param(contact).param(address).param(area).param(status).param(id).update();
        return this.get(id);
    }

    void delete(long id) {
        this.jdbc.sql("DELETE FROM residents WHERE id = ?").param(id).update();
    }
}

