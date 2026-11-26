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

**AgosPantay** is a centralized Java application that allows for communication between the community members and water management personnel via **Resident** and **Administrator** portals.

Residents can access the water distribution schedule, water source conditions, distribution personnel, and notifications. Residents can also submit water-related reports, request water assistance, and monitor their status. The administrators will be able to manage community records, set up distribution schedules, document water source conditions and allocation, review resident reports and requests, and generate analytics and record history.

AgosPantay is intended to enhance communication, documentation, transparency, and coordination of the community water distribution process.

## Problem Being Addressed

Some barangays in the community get their water from natural sources like mountain springs, rivers, and water distribution systems maintained by the community, rather than being connected to water utilities or suppliers. Water distribution in the barangays follows a schedule where the water can be distributed to different houses or services.

However, there are cases where residents experience delays in the schedule, poor water pressure, inadequate water supply, water service disruptions, and uneven distribution of water. Houses that are situated at higher places or far from the source receive less water pressure than those closer to the source. During dry season and scarcity of water, the situation becomes worse and affects the daily routines of residents.

Moreover, residents lack an organized system of filing complaints and requesting additional water services and information about their complaints. Without having records, the officials of the barangay find it difficult to organize their schedule, monitor the water condition, and report back to the household concerned.

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

## 👥Target Users
| Target User | How They Will Use the System |
|---|---|
| **Community Residents** |•	Register an account and securely sign in.
•	Complete and update their personal profiles and service area information.
•	View water distribution schedules, local water source status, and assigned distribution personnel relevant to their registered area.
•	Check distribution dates using the schedule calendar.
•	Read community announcements and water service advisories.
•	Submit reports concerning water distribution problems.
•	Request additional water assistance.
•	Track the status of their submitted reports and requests using tracking codes.
•	View administrator responses and mark notifications as read.
•	Access water conservation information and emergency contact details.|
| **Barangay Officials and Water Management Personnel (Administrators)** | •	View the community water management dashboard.
•	Manage registered resident accounts and account statuses
•	Organize barangays, zones, and service areas.
•	Maintain water source information and recorded supply conditions.
•	Create and manage water distribution schedules.
•	Maintain water allocation records.
•	Manage water management personnel information.
•	Publish announcements and advisories.
•	Review resident reports and complaints.
•	Review and process water assistance requests.
•	Update submission statuses and provide official responses.
•	Review analytics summaries, complete records history, and system activity logs.
•	Manage portal community and barangay settings. |

## ✨Main Features
### Resident Portal
 
| Feature | Description |
|---|---|
| Resident Dashboard | Overview of schedules, water source conditions, active personnel, reports, requests, and announcements |
| My Water Schedule | Distribution schedules for the resident's registered service area |
| Schedule Calendar | Monthly calendar view of distribution dates |
| Announcements | Official announcements and service advisories |
| Submit a Report | Report weak flow, damaged pipes, water quality concerns, delays, interruptions, and unequal distribution |
| My Reports | View submitted reports, statuses, and administrator responses |
| Water Assistance | Request additional water supply and track progress |
| Notifications | Updates on announcements, reports, and requests, with read/unread tracking |
| My Profile | Manage personal information and service area details |
| Water Conservation | Practical guidelines on proper water usage |
| Emergency Contacts | Contact information for barangay officials and emergency personnel |
 
### Administrator Portal
 
| Feature | Description |
|---|---|
| Administrator Dashboard | Overview of residents, schedules, pending reports, announcements, and water availability |
| Residents Management | Manage resident information and account statuses |
| Barangay and Zones Management | Organize barangays, zones, and service areas |
| Water Sources Management | Maintain water sources and their availability conditions |
| Distribution Schedules Management | Create and manage schedules by area, date, and opening and closing times |
| Water Allocation Management | Record and monitor water allocation per area |
| Distribution Personnel Management | Manage personnel involved in water distribution |
| Announcements Management | Create, edit, and publish announcements and advisories |
| Reports and Complaints Management | Review reports, update statuses, and respond officially |
| Water Requests Management | Approve, fulfill, or reject requests for additional water |
| Analytics and Reports | Summary metrics and breakdowns of submissions and operations |
| Records History | Consolidated view of historical records |
| Activity Logs | Chronological audit records of user and admin activities |
| System Settings | Configure community and barangay portal details |

## 🤖Technologies Used
| Technology / Tool | Purpose |
|---|---|
| **Java 21** | Main language for application logic, data models, validation, and OOP implementation |
| **Spring Boot** | Backend framework, dependency injection, and REST API controllers |
| **Spring Security** | Authentication and role-based access control |
| **JDBC** | Communication between the Java application and the database |
| **H2 Database** | Stores resident profiles, accounts, water records, reports, requests, and other system data |
| **HTML5 / CSS3 / JavaScript** | Resident and administrator web interfaces, styling, and frontend interactions |
| **Maven** | Dependency management and packaging of the runnable JAR |
| **IntelliJ IDEA** | Development and debugging |
| **Git & GitHub** | Version control and team collaboration |

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
 
| Class | Role |
|---|---|
| `WaterSubmission` | Abstract superclass with common submission fields, serialization structure (`fields()`), and status rules |
| `WaterReport` | Extends `WaterSubmission` with report-specific attributes (location, details, category, priority) and validation rules |
| `WaterRequest` | Extends `WaterSubmission` with request-specific attributes (quantity, householdSize, reason) and range validations |
 
### Polymorphism
- `ResidentService.submit(WaterSubmission, String)` accepts any `WaterSubmission` and calls `validateForSubmission()` and `fields()`, which dispatch to the overridden `validateDetails()` and `detailFields()` of either `WaterReport` or `WaterRequest`.
- `AdminService.update()` reconstructs records into their `WaterSubmission` subtypes so `updateStatus()` enforces the right statuses for each type:
  - **Reports:** Submitted, Under Review, Action Taken, Resolved, Rejected
  - **Requests:** Submitted, Under Review, Approved, Fulfilled, Rejected

 ## Instructions for Running the Program
### Requirements
 
- **Java 21 (JDK 21)**
- **Maven** (or use IntelliJ IDEA, which bundles Maven)
- A web browser (desktop or mobile)
### Option A: Run with Maven (command line)
 
```bash
# 1. Clone the repository
git clone https://github.com/Kristal29/AgosPantay_Community-Water-Access-Allocation-and-Conflict-Resolution-Management-System.git
 
# 2. Go to the project folder (the Maven project is inside the AgosPantay folder)
cd AgosPantay_Community-Water-Access-Allocation-and-Conflict-Resolution-Management-System/AgosPantay
 
# 3. Build and run
mvn spring-boot:run
```
 
Or build the runnable JAR and run it:
 
```bash
mvn clean package
java -jar target/AgosPantay_Project.jar
```

### Access from other devices (classroom demo)
 
1. Connect the other device (phone or laptop) to the **same Wi-Fi network** as the computer running AgosPantay.
2. Find the host computer's IP address (`ipconfig` on Windows, `ifconfig` or `ip a` on Mac and Linux).
3. On the other device, open `http://<host-computer-IP>:8080`.
If the page does not load, check that the host computer's firewall allows incoming connections on that port.

### Database

AgosPantay uses a local **H2 file-based database**, so no separate database installation is needed. Data is stored on the computer running the application.

## Sample Screenshots
 
| Resident Portal | Administrator Portal |
|---|---|
| ![Log In Dashboard](screenshots/01-Login.png) | ![Admin Review](screenshots/03-Admin-Review.png) |
| ![Resident Submission](screenshots/02-Resident-Submission.png) | ![Resident Status](screenshots/04-Resident-Status.png) |

## Known Limitations

1. **Implementation in a single community** – works on a single community at a time, not multiple independent communities.
2. **Water information input manually** – water sources’ conditions, availability, schedules, and allocation data are entered by administrators; there are no water level/pressure sensors.
3. **No GPS-based tracking system** – works with text barangay, zone, and purok identifiers without the GPS-based location of households.
4. **Network dependence** – the application must be run on its designated Java host; other devices connect to it using an accessible network (same Wi-Fi for class demo).
5. **Host computer database** – uses an H2 file database on the host computer instead of a cloud-based database.
6. **Refresh-based updates** – the administrator’s changes become visible in the resident portal upon refresh of the website or opening of a new page; no synchronization is used.
7. **Notifications based on portals only** – there are no in-portal notifications and announcements, as well as SMS service.
8. **No automatic water distribution control** – scheduling and allocation of water is done digitally without control of pumps, valves, and pipelines.

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
