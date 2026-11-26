# 💧 AgosPantay
 
### Community Water Access, Allocation, and Conflict Resolution Management System
> **OOP 101 – Object Oriented Programming** | Team 6 – Triple J | Section CS-2105
> 
> Computer Science Department, College of Informatics and Computing Sciences
> Batangas State University – The National Engineering University, Alangilan Campus
> 
> 1st Semester, AY 2026–2027
 
## 📑 Table of Contents
 
1. [Project Description](#project-description)
2. [Problem Being Addressed](#problem-being-addressed)
3. [Project Objectives](#project-objectives)
4. [Target Users](#target-users)
5. [Main Features](#main-features)
6. [Technologies Used](#technologies-used)
7. [Team Members and Roles](#team-members-and-roles)
8. [OOP Concepts Demonstrated](#oop-concepts-demonstrated)
9. [Instructions for Running the Program](#instructions-for-running-the-program)
10. [Sample Screenshots](#sample-screenshots)
11. [Known Limitations](#known-limitations)
12. [Future Improvements](#future-improvements)
13. [Project Contributors](#project-contributors)

## ✍🏻Project Description

**AgosPantay** is a centralized Java application that connects community residents with water management personnel through separate via **Resident** and **Administrator** portals.

The system allows residents to view water distribution schedules, local water source conditions, active distribution personnel, and announcements, as well as submit water-related reports, request water assistance, and monitor the status of their submissions. Meanwhile, administrators can manage community records, maintain distribution schedules, record water source conditions and allocation information, review resident reports and requests, view analytics and record histories, and provide official responses.

Through these functionalities, AgosPantay aims to improve communication, record management, transparency, and coordination in community water distribution process.

## Problem Being Addressed

Some communities, particularly barangays located near or at the foot of mountains, depend on natural water sources such as mountain springs, rivers, and community-managed water systems instead of being connected to established water service providers. In these communities, water distribution is commonly managed through scheduled opening and closing times to ensure that available water reaches different households and service areas.

However, residents may experience several problems, including delayed distribution schedules, weak water flow, insufficient water supply, unexpected service interruptions, and unequal water distribution. Households located in higher areas or farther from the main water source may experience lower water pressure or receive insufficient water compared to those located closer to the source. During dry seasons or periods of limited water availability, these problems may become more serious and affect the daily activities of residents.

Another concern is the difficulty of communicating water-related problems to the personnel responsible for managing community water distribution. Residents may have no organized way to submit complaints, request additional water assistance, or monitor the progress of their submitted concerns. Without a centralized record-keeping system, barangay officials and water management personnel may also experience difficulties organizing distribution schedules, monitoring reported water conditions, managing requests, and providing updates to affected households.

## Project Objectives
### General Objective
 
To develop AgosPantay, a Java-based web application that provides a centralized platform for organizing community water distribution information, managing resident concerns and assistance requests, and improving coordination between residents and water management personnel.

### Specific Objectives

1.	To develop a centralized resident and administrator portal that provides organized access to community water distribution information and management functionalities.
2.	To implement a resident registration and authentication feature that allows community members to create accounts, sign in securely, and manage their personal profiles and service area information.
3.	To provide a water distribution scheduling feature that allows residents to view their assigned distribution schedules and check upcoming distribution dates through a schedule list and monthly calendar.
4.	To develop an announcement and advisory feature that enables administrators to publish important updates regarding water distribution, service interruptions, and other community water-related information.
5.	To provide a water reporting feature that allows residents to submit complaints and concerns regarding weak water flow, pipe damage, water quality, insufficient supply, delayed schedules, and other water distribution problems.
6.	To implement a water assistance request feature that allows residents to submit requests for additional water supply and monitor the progress of their requests.
7.	To provide a submission tracking feature that generates tracking reference numbers for resident reports and requests, allowing residents to monitor their submission status and view official responses from administrators.
8.	To develop an administrator management portal that enables authorized personnel to manage registered residents, barangay and service zones, water sources, distribution schedules, water allocation records, distribution personnel, announcements, reports, water assistance requests, analytics, and record histories.
9.	To provide a water source monitoring and recording feature that allows administrators to maintain information about water availability and service conditions in different community service areas.
10.	To maintain organized records of resident accounts, water distribution schedules, submitted reports, assistance requests, administrative actions, and their corresponding statuses using a centralized database.
11.	To implement activity logs and read-receipt notification features that help residents and administrators monitor relevant updates and activities within the system.
12.	To apply the four fundamental principles of Object-Oriented Programming such us abstraction, encapsulation, inheritance, and polymorphism in developing the system's Java classes, business logic, and submission management processes.
13.	To improve the accessibility of community water information by allowing residents and administrators to access their respective portals through desktop and mobile web browsers connected to the same network as the running application.


## Target Users
AgosPantay is designed primarily for two categories of users:
| **Target User** | **How They Will Use the System** |
|---|---|
| **Community Residents** | - Register an account and securely sign in.<br>- Complete and update their personal profiles and service area information.<br>- View water distribution schedules, local water source status, and assigned distribution personnel relevant to their registered area.<br>- Check distribution dates using the schedule calendar.<br>- Read community announcements and water service advisories.<br>- Submit reports concerning water distribution problems.<br>- Request additional water assistance.<br>- Track the status of their submitted reports and requests using tracking codes.<br>- View administrator responses and mark notifications as read.<br>- Access water conservation information and emergency contact details. |
| **Barangay Officials and Water Management Personnel (Administrators)** | - View the community water management dashboard.<br>- Manage registered resident accounts and account statuses.<br>- Organize barangays, zones, and service areas.<br>- Maintain water source information and recorded supply conditions.<br>- Create and manage water distribution schedules.<br>- Maintain water allocation records.<br>- Manage water management personnel information.<br>- Publish announcements and advisories.<br>- Review resident reports and complaints.<br>- Review and process water assistance requests.<br>- Update submission statuses and provide official responses.<br>- Review analytics summaries, complete records history, and system activity logs.<br>- Manage portal community and barangay settings. |

## ✨Main Features
The system consists of two main interfaces:
### Resident Portal
 
| Feature | Description |
|---|---|
| Resident Dashboard |Displays an overview of the resident's water schedules, water source conditions, active personnel, submitted reports, assistance requests, and community announcements. |
| My Water Schedule |Allows residents to view water distribution schedules applicable to their registered service area. |
| Schedule Calendar | Presents water distribution schedules in a monthly calendar format for easier viewing of distribution dates.|
| Announcements | Allows residents to view official community announcements, water distribution updates, and service advisories. |
| Submit a Report | Enables residents to submit reports about water-related problems, including weak water flow, damaged pipes, water quality concerns, delayed schedules, interruptions, and unequal distribution. |
| My Reports | Allows residents to view their submitted reports, monitor their statuses, and read official responses from administrators. |
| Water Assistance | Allows residents to submit requests for additional water supply and monitor the progress of their requests. |
| Notifications | Displays relevant updates regarding announcements, reports, and water assistance requests, including read and unread notifications. |
| My Profile | Allows residents to view and manage their personal information and registered service area details. |
| Water Conservation | Provides residents with practical guidelines and information about proper water usage and conservation. |
| Emergency Contacts | Displays important contact information for barangay officials and other relevant community emergency personnel.|
 
### Administrator Portal
 
| Feature | Description |
|---|---|
| Administrator Dashboard | Displays an overview of registered residents, water distribution schedules, pending reports, announcements, and recorded water availability.|
| Residents Management | Allows administrators to view and manage registered resident information and account statuses.|
| Barangay and Zones Management | Allows administrators to organize and manage barangay locations, community zones, and water distribution service areas. |
| Water Sources Management | Allows administrators to maintain records of community water sources and their recorded availability conditions.|
| Distribution Schedules Management | Enables administrators to create, update, and manage water distribution schedules based on specific areas, dates, and opening and closing times.|
| Water Allocation Management | Allows administrators to record, organize, and monitor water allocation information for different community areas.|
| Distribution Personnel Management | Allows administrators to manage information about personnel involved in community water distribution and management. |
| Announcements Management | Enables administrators to create, edit, update, and publish official announcements and water service advisories.|
| Reports and Complaints Management | Allows administrators to review residents' water-related reports and complaints, update their statuses, and provide official responses.|
| Water Requests Management | Enables administrators to review, approve, fulfill, or reject residents' requests for additional water supply.|
| Analytics and Reports | Displays summarized information and statistical breakdowns of community water submissions and distribution operations.|
| Records History | Provides administrators with access to historical records of community water management activities and transactions.|
| Activity Logs | Maintains chronological records of user and administrative activities for monitoring and accountability.|
| System Settings |Allows administrators to configure community and barangay portal information and other system settings.|

## 🤖 Technologies Used

The following technologies and tools are used in developing AgosPantay:

| **Technology / Tool** | **Purpose** |
|---|---|
| **Java 21** | Main programming language for application logic, data models, validation, and OOP implementation. |
| **Spring Boot** | Provides the backend application framework, dependency injection, and REST API controllers. |
| **Spring Security** | Handles authentication and role-based access control. |
| **JDBC** | Facilitates communication between the Java application and the database. |
| **H2 Database** | Stores resident profiles, accounts, water records, reports, requests, and other system information. |
| **HTML5** | Structures the resident and administrator web interfaces. |
| **CSS3** | Provides the layout, styling, and responsive design of the application. |
| **JavaScript** | Handles frontend interactions, form submissions, data retrieval, and portal functionality. |
| **Maven** | Manages project dependencies and packages the runnable JAR archive. |
| **IntelliJ IDEA** | Used for Java development, debugging, and project management. |
| **Git & GitHub** | Used for version control and team collaboration. |

## Team Members and Roles
**Team 6 – Triple J** | Section **CS-2105**
 
| No. | SR-Code | Name | Role |
|---|---|---|---|
| 1 | 25-02469 | Lindo, Kristal Joy H. | UI/UX / Project Leader |
| 2 | 25-09379 | Palacol, Jana Beatrice T. | Documentation |
| 3 | 25-00783 | Quito, James Andrey O. | Lead Programmer |

## OOP Concepts Demonstrated
### Abstraction
The abstract class `WaterSubmission` defines the common properties and validation contract shared by water reports and water assistance requests. Instead of duplicating shared information, subclasses must provide their own validation behavior.
 
### Encapsulation
Fields in `WaterSubmission`, `WaterReport`, and `WaterRequest` are declared `private`, with controlled access through getters and state-transition methods. `updateStatus()` checks that a requested status change is allowed by the submission's `CommunityModule` before changing internal state, which prevents invalid status transitions.
 
### Inheritance
The system uses inheritance to reuse common submission properties and methods.

| **Class** | **Role** |
|---|---|
| `WaterSubmission` | Abstract superclass containing common submission fields, getters, validation structure, status handling, and the `fields()` method. |
| `WaterReport` | Extends `WaterSubmission` with report-specific attributes such as location, details, category, and priority, including its own validation rules. |
| `WaterRequest` | Extends `WaterSubmission` with request-specific attributes such as quantity, household size, and reason, including its own validation rules. |

### Polymorphism
- `ResidentService.submit(WaterSubmission, String)` accepts a `WaterSubmission` object, allowing it to process either a `WaterReport` or a `WaterRequest`. Calls to `validateDetails()`, `detailFields()`, and `module()` execute the overridden methods of the actual subclass.
- `AdminService` uses `SubmissionRecords.forReview()` to reconstruct the appropriate `WaterSubmission` subtype when processing a status update. The `updateStatus()` method then checks the requested status against the allowed statuses for that submission type.

The system supports the following submission statuses:
- **Water Reports:** Submitted, Under Review, Action Taken, Resolved, Rejected.
- **Water Assistance Requests:** Submitted, Under Review, Approved, Fulfilled, Rejected.

 ## Instructions for Running the Program
### Requirements

- **Java 21 (JDK 21)**
- **Apache Maven** (or IntelliJ IDEA with Maven support)
- A web browser (desktop or mobile)

### Option A: Run with Maven (Command Line)

1. Clone the repository:

   ```bash
   git clone https://github.com/Kristal29/AgosPantay_Community-Water-Access-Allocation-and-Conflict-Resolution-Management-System.git
   ```

2. Navigate to the project directory containing `pom.xml`:

   ```bash
   cd AgosPantay_Community-Water-Access-Allocation-and-Conflict-Resolution-Management-System
   ```

   If the Maven project is inside a separate `AgosPantay` folder, navigate into that folder before proceeding.

3. Build and run the application:

   ```bash
   mvn spring-boot:run
   ```

4. Once the application starts successfully, open:

   ```text
   http://localhost:8080
   ```
   
 ### Option B: Build and Run the Executable JAR

1. Navigate to the project directory containing `pom.xml`.
2. Build the executable JAR:

   ```bash
   mvn clean package
   ```

3. Run the generated JAR file:

   ```bash
   java -jar target/AgosPantay.jar
   ```

4. Open the application in your browser:

   ```text
   http://localhost:8080
   ```

### Access from Other Devices (Classroom Demonstration)

1. Connect the other device (phone or laptop) to the same Wi-Fi network as the computer running AgosPantay.
2. Find the host computer's local IP address:
   - **Windows:** Open Command Prompt and execute `ipconfig`. Look for the IPv4 Address under the active Wi-Fi adapter.
   - **Linux:** Open the terminal and execute `ip a`.
   - **macOS:** Check the Wi-Fi network details under System Settings → Network.
3. On the other device, open a web browser and enter:

   ```text
   http://<host-computer-IP>:8080
   ```

   Replace `<host-computer-IP>` with the actual IPv4 address of the host computer.

4. If the page does not load, check whether the host computer's firewall allows incoming connections through port `8080` and whether both devices can communicate over the same network.

### Database

AgosPantay uses a local **H2 file-based database**, so no separate database installation is required.

Database records are stored on the computer running the application, specifically in the `data/agospantay.mv.db` file. This allows the system to retain its records between application restarts.

## Sample Screenshots
 
| Resident Portal | Administrator Portal |
|---|---|
| ![Log In Dashboard](screenshots/01-Login.png) | ![Admin Review](screenshots/03-Admin-Review.png) |
| ![Resident Submission](screenshots/02-Resident-Submission.png) | ![Resident Status](screenshots/04-Resident-Status.png) |

## Known Limitations
Despite providing centralized community water management functionalities, AgosPantay has the following limitations:
1.	**Single Community Implementation:** The current prototype is designed to support one community at a time. It is not yet designed for simultaneous independent management of multiple communities.
2.	**Manual Water Information Entry:** Water source conditions, water availability, distribution schedules, and allocation information are recorded and maintained manually by authorized administrators. The system does not automatically measure actual water levels or pressure through sensors.
3.	**No Automatic GPS Tracking:** The current version uses registered barangay, zone, and purok text identifiers rather than GPS-based household location tracking.
4.	**Internet and Network Dependency:** The application must be running on its designated Java host. Other devices can access it through a reachable network connection. For the classroom demonstration, devices should be connected to the same Wi-Fi network.
5.	**Local File-Based Database Storage:** The system uses an H2 file-based database stored on the computer running the application. Records are maintained through the local database rather than a separate cloud-hosted database.
6.	**Refresh-Based Updates:** Changes made by administrators are reflected in the resident portal when the relevant records are refreshed or the corresponding page is reopened. The current prototype does not establish automatic real-time synchronization.
7.	**Limited Automated Notifications:** The system provides notification and announcement functionalities within its portals but does not include an established automatic SMS notification service.
8.	**No Automatic Water Distribution Control:** AgosPantay manages and records water distribution schedules and allocations digitally without physically controlling water pumps, valves, or pipelines.



## Future Improvements
 
- Support multiple communities with independent management
- Integrate sensors for automatic water level and pressure readings
- Add GPS-based household location tracking
- Move to a cloud-hosted database
- Add real-time updates between the administrator and resident portals
- Add SMS notifications
- Integrate with pumps or valves for automated distribution control

## Project Contributors
| Name | Role | GitHub |
|---|---|---|
| Lindo, Kristal Joy H. | UI/UX / Project Leader | [@Kristal29](https://github.com/Kristal29) |
| Palacol, Jana Beatrice T. | Documentation | [@pixiee1106](https://github.com/pixiee1106) |
| Quito, James Andrey O. | Lead Programmer | [@quitjames](https://github.com/quitjames) |
 
**Instructor:** Mr. Glenn M. Guinoban

*Leading Innovations, Transforming Lives, Building the Nation*
