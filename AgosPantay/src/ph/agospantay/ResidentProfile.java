package ph.agospantay;

record ResidentProfile(long id, String name, String contact, String address, String area, String status) {
    boolean active() {
        return "Active".equals(this.status);
    }

    boolean complete() {
        return !this.address.isBlank() && !this.area.isBlank();
    }
}

