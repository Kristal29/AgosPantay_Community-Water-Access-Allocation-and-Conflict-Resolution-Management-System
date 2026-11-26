package ph.agospantay;

import java.util.List;

enum CommunityModule {
   ZONES("zones", "zone", new String[0]),
   SOURCES("sources", "water source", new String[]{"Normal", "Low Supply", "Interrupted"}),
   SCHEDULES("schedules", "distribution schedule", new String[]{"Scheduled", "Ongoing", "Completed", "Cancelled"}),
   ALLOCATION("allocation", "water allocation", new String[]{"Recorded", "Pending"}),
   PERSONNEL("personnel", "personnel record", new String[]{"Active", "On-Leave"}),
   ANNOUNCEMENTS("announcements", "announcement", new String[]{"Published", "Draft"}),
   REPORTS("reports", "water report", new String[]{"Submitted", "Under Review", "Action Taken", "Resolved", "Rejected"}),
   REQUESTS("requests", "water request", new String[]{"Submitted", "Under Review", "Approved", "Fulfilled", "Rejected"});

   final String key;
   final String description;
   final List<String> statuses;

   private CommunityModule(String key, String description, String... statuses) {
      this.key = key;
      this.description = description;
      this.statuses = List.of(statuses);
   }

   boolean isSubmission() {
      return this == REPORTS || this == REQUESTS;
   }

   static CommunityModule from(String key) {
      for(CommunityModule module : values()) {
         if (module.key.equals(key)) {
            return module;
         }
      }

      throw ApiProblem.notFound("This records section does not exist.");
   }
}
