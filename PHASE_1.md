# 3813ICT – Full Stack Development Assignment: Phase 1 
**Student Name:** Alpa Sahai 
**Student ID:** s5405889
**Workshop:** Wednesday, 3.00 pm - 5.00 pm (Allan Browning)

## Project Overview: 
A colourful, friendly user space: Fabulari.

Fabulari is a multi-user, group chat web application built using the MEAN stack: MongoDB, Express, Angular and Node.js. The application is a fun environment for users to interact in chat spaces (groups and rooms) and share text messages and images. The application supports three permisson tiers: Users, Group Admin and Super Admin, each with their distinct interfaces and unique capabilities. 

This document provides an outline for the GIT stratergies implements, functional requirements, data structures, angular architecture, endpoints and design descions for the Fabulari application, according to Phase 1. 

## GIT Strategies: 
For this project, the workflow that allows for feature-branches, with main branch storing the full functioning code. During the planning process, the idea of a `dev` branch came up. This was discarded as this projects is a solo project so there's no verification component required and the work does not require isolation. 

### Branching Methods:
    - `main` - the working version of the application
    - `feature/<name>` - creating one branch for each feature/page; created off main branch:
        -`feature/opening-screen`
        - `feature/login-signup`
        - `feature/main-page`
        - `feature/profile-page`
        - `feature/group-page` 
        - `feature/groupadmin-requests`
        - `feature/superadmin-requests`

### Workflow:
1. Creating a `feature/<name>` branch off the `main` branch before starting a new screen/component.
2. Ensuring to commit in small steps throughout project; commit history reflects development of Fabulari.
3. Testing each feature against its wireframe before merging and ensuring that it is fully functioning before merging to the `main` branch.
4. Double checking with the documentation and criteria to ensure feature meets the requirements. 
5. Closing the branch once feature is fully functional and has been commited to `main` branch.

### Commit Convention
Commits follow a structure to ensure it's identifiable what Phase it belongs to and it will have a description for readability, e.g.:
- Phase 1: Wireframes and Design Document Upload
- Phase 1: FEATURE: Adding in the Login Verification
- PHASE 1: UPDATED: Login Page now functions as required. 


## Functional Requirements: 
### Roles & Permissions:
| ID | Requirement | User Type | Priority | Assumption |
|----|-------------|-----------|----------|------------|
| FR-01 | Users and Group Admins can send messages in chat rooms | User, Group Admin | Must | Super Admin never sends chat messages |
| FR-02 | Users can request to create a group; becomes Group Admin of it once approved | User | Must | Request must include title, description, age limit, colour theme |
| FR-03 | Group Admins can request group deletion; requires Super Admin approval | Group Admin | Must | GA is demoted to User once deletion is actioned |
| FR-04 | Group Admins can edit group name, description, theme, and age limit without approval | Group Admin | Must | Raising age limit auto-removes now-ineligible members |
| FR-05 | Group Admins can create, edit, and delete chat rooms without approval | Group Admin | Must | — |
| FR-06 | Users can propose a new room; Group Admin approves or rejects with a reason | User | Should | — |
| FR-07 | Group Admins can approve or reject join requests | Group Admin | Must | — |
| FR-08 | Group Admins can promote a member to Group Admin directly | Group Admin | Must | No approval step required |
| FR-09 | An existing Group Admin can demote another Group Admin | Group Admin | Should | Group must retain ≥1 Group Admin at all times |
| FR-10 | Group Admins can ban a user from their group after a member report/request | Group Admin | Must | Cannot ban unprompted |
| FR-11 | Super Admin can ban/delete a user system-wide based on a Group Admin request | Super Admin | Must | SA only acts on requests, never unprompted |
| FR-12 | Users and Group Admins can request account deletion; requires Super Admin approval | User, Group Admin | Must | Blocked if sole admin of a group, or would leave a group with 0 members |
| FR-13 | Users and Group Admins can delete their own messages only | User, Group Admin | Should | UI mechanism (e.g. right-click) is implementation's choice |
| FR-14 | Super Admin can view a full, filterable audit log of all admin actions | Super Admin | Must | Filterable by type and date |
| FR-15 | Group Admins can view their own group's member list and ban history only | Group Admin | Should | No access to system-wide audit log |
| FR-16 | System supports exactly one Super Admin, created via one-time bootstrap on first start | Super Admin | Must | Cannot be deleted or delete themselves |
| FR-17 | A group can have multiple Group Admins; an admin can administer unlimited groups | Group Admin | Should | — |
| FR-18 | Group Admins display a visible badge while chatting in a group they administer | Group Admin | Could | — |

### Accounts & Profiles:
| ID | Requirement | User Type | Priority | Assumption |
|----|-------------|-----------|----------|------------|
| FR-19 | Email is immutable and unique; system-banned emails can never be reused | All | Must | Acts as the account's unique identifier |
| FR-20 | Username is editable | All | Could | Optional field to implement |
| FR-21 | Password is editable, requiring old + new password confirmation | All | Must | Min 8 chars, 1 uppercase, alphanumeric, hashed via bcrypt |
| FR-22 | Age is stored as self-reported date of birth at signup | All | Must | Used to enforce group age limits |
| FR-23 | Users can toggle light/dark theme | All | Should | Personal preference, stored on profile |
| FR-24 | Users can set a personal chat colour theme, overriding the group default | All | Should | One personal colour applies across all groups, not per-group |
| FR-25 | Users can upload/edit a profile picture | All | Should | — |
| FR-26 | Profiles are private; no public profile viewing | All | Must | Optional hover-preview of name/description is implementation's choice |
| FR-27 | Registration is self-service for all users | User | Must | — |

### Groups & Rooms Logic:
| ID | Requirement | User Type | Priority | Assumption |
|----|-------------|-----------|----------|------------|
| FR-28 | Any user can browse all existing groups | User | Must | Group visibility is fully open |
| FR-29 | Users can request to join a group; request sits pending until Group Admin action | User | Must | — |
| FR-30 | Underage join attempts are auto-rejected with an explanatory message | User | Must | Group remains visible even if user doesn't meet age requirement |
| FR-31 | Group titles are unique and capped at 30 characters; descriptions capped at 250 characters | Group Admin | Must | No group profile picture supported |
| FR-32 | Group age limit applies to all rooms within that group | Group Admin | Must | — |
| FR-33 | Groups may have zero or unlimited rooms | Group Admin | Should | — |
| FR-34 | Pending/rejected requests (join, room, ban) cannot be cancelled once submitted | User | Must | Users can view their own pending/rejected requests, with rejection reasons shown |

### Chat & Messaging:
| ID | Requirement | User Type | Priority | Assumption |
|----|-------------|-----------|----------|------------|
| FR-35 | Users can only be active in one chat room at a time | User | Must | — |
| FR-36 | Messages display timestamp and sender name | User | Must | No unique message ID shown in UI |
| FR-37 | No unread message indicators are shown | User | Must | Messages only visible live while in the room |
| FR-38 | Only the last 5 messages per room are retained server-side | System | Must | Phase 2: MongoDB, roughly LIFO-style |
| FR-39 | Users see a live list of who else is present in their current room | User | Should | Toast notification on join/leave, dismissible via X |
| FR-40 | Deleted user's messages are removed live from other users' open chats via WebSocket | System | Should (Phase 2) | Not required for Phase 1 prototype; noted for architecture only |
| FR-41 | File uploads limited to PNG/JPEG/GIF images under 2MB | User | Should | — |

### Security & Non-Functional Requirements:
| ID | Requirement | User Type | Priority | Assumption |
|----|-------------|-----------|----------|------------|
| FR-42 | Authentication is basic username/password only | All | Must | No OAuth or third-party sign-in |
| FR-43 | Passwords are hashed before storage | System | Must | bcrypt or equivalent |
| FR-44 | Client-server communication uses HTTPS in the final build | System | Should | Not required for local Phase 1 prototype |
| FR-45 | All admin actions (user/group/room CRUD, membership, bans) are logged | System | Must | Feeds the Super Admin audit log page |
| FR-46 | Prototype supports a minimum of 10 concurrent users | System | Could | Unlimited users per room otherwise |

## Data Structures used in Fabulari: 
The following tables showcase the data structures that will be used for the Fabuari application: 
### User
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `username` | String | Display name / login handle |
| `email` | String | Contact email, used at signup |
| `password_hash` | String | Hashed password (never stored plaintext) |
| `dob` | Date | Used to enforce age limits on group joining |
| `pfp_url` | String | Path/URL to uploaded profile picture |
| `theme` | String (enum: `light`, `dark`, `colour`) | User's selected UI theme |
| `system_role` | String (enum: `standard`, `super_admin`) | Global permission level |
| `favourite_groups` | Array<ObjectId> | Groups starred by the user |
| `is_banned` | Boolean | System-level ban flag (Super Admin action) |
| `banned_from_groups` | Array<ObjectId> | Group-level bans (separate from system ban) |

### Group
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `name` | String | Group display name |
| `description` | String | Shown on group creation/manage modal |
| `age_limit` | Number | Minimum age to join, set at creation |
| `theme` | String | Group's visual theme |
| `admin_ids` | Array<ObjectId> | Users with Group Admin permissions for this group |
| `member_ids` | Array<ObjectId> | All members of the group |
| `room_ids` | Array<ObjectId> | Rooms belonging to this group |
| `status` | String (enum: `pending`, `approved`, `rejected`) | Super Admin approval state |
| `rejection_reason` | String | Populated if `status` is `rejected` |

### Room
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `group_id` | ObjectId | Parent group reference |
| `name` | String | Room name, set on creation |

### Message
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `room_id` | ObjectId | Room the message belongs to |
| `sender_id` | ObjectId | Reference to sending User |
| `text` | String | Message content |
| `time_stamp` | Date | Sent time, shown in chat window |

### GroupCreationRequest
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `requested_by` | ObjectId | User who submitted the request |
| `group_name` | String | Proposed group name |
| `description` | String | Proposed description |
| `age_limit` | Number | Proposed age limit |
| `status` | String (enum: `pending`, `approved`, `rejected`) | Super Admin decision |
| `rejection_reason` | String | Shown to requester if rejected |

### JoinRequest
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `group_id` | ObjectId | Group being requested to join |
| `user_id` | ObjectId | Requesting user |
| `status` | String (enum: `pending`, `approved`, `rejected`) | Group Admin decision |

### ReportRequest (Ban/Removal)
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `reporter_id` | ObjectId | User who filed the report |
| `target_user_id` | ObjectId | User being reported |
| `group_id` | ObjectId or null | Group context, if group-level (null = system-level report) |
| `reason` | String | Reason provided in report modal |
| `status` | String (enum: `pending`, `approved`, `denied`) | Super Admin decision |

### AuditLogEntry
| Field | Type | Description |
|-------|------|--------------|
| `id` | ObjectId | Unique identifier |
| `action` | String | e.g. `group_approved`, `user_banned`, `group_rejected` |
| `performed_by` | ObjectId | Super Admin who took the action |
| `target_id` | ObjectId | Affected user/group |
| `time_stamp` | Date | When the action occurred |

## Angular Architecture: 
For the angualar architecture of Fabulari, it has been structured to better suit the application to work with different workflows within the application e.g. User vs Group Admin vs Super Admin. 

### Routing
- `/` — Opening screen
- `/login` — Login screen
- `/signup` — Sign up screen
- `/app/main` — Main page (My Groups + Join Groups)
- `/app/profile` — Profile screen
- `/app/group/:groupId` — Group page (rooms + chat + members)
- `/app/group/:groupId/requests` — Group Admin join-request queue (route-guarded, Group Admin only)
- `/superadmin/requests` — Super Admin request queue + audit log

The `/superadmin` route is deliberately isolated as its own lazy-loaded module with no shared layout with `/app`, reflecting that the Super Admin workflow never overlaps with User/Group Admin navigation.

### Components
| Component | Role |
|-----------|------|
| `OpeningScreenComponent` | Landing screen, links to login/signup |
| `LoginComponent` | Username/password auth form |
| `SignupComponent` | Registration form incl. DOB check, pfp upload, theme selection |
| `MainPageComponent` | Hosts My Groups + Join Groups sections |
| `MyGroupsListComponent` | Displays favourites, admin groups, full group list |
| `JoinGroupsComponent` | Browse groups, view own join requests + status |
| `ProfileComponent` | View/edit profile, delete account |
| `GroupPageComponent` | Container for rooms sidebar, chat window, members sidebar |
| `RoomsSidebarComponent` | Lists rooms, create/manage room actions |
| `ChatWindowComponent` | Displays messages for active room, message input |
| `MembersSidebarComponent` | Lists group members, edit/report actions |
| `GroupAdminRequestsComponent` | Group Admin's join-request approval queue |
| `SuperAdminRequestsComponent` | Super Admin's group-creation + ban/removal queues |
| `AuditLogComponent` | Read-only log of Super Admin actions |
| `GroupCreationModalComponent` | Modal for submitting a new group request |
| `ManageGroupModalComponent` | Edit/delete group (Group Admin) |
| `NewRoomModalComponent` | Create a new room within a group |
| `ReportModalComponent` | Submit a report/ban request on a member |
| `MessageModalComponent` | Generic confirmation/rejection message popup |

### Services
| Service | Role |
|---------|------|
| `AuthService` | Login/logout/signup, stores current user, exposes permission checks |
| `SocketService` | Wraps Socket.IO client for real-time messaging |
| `GroupService` | CRUD + favourite/join calls for groups |
| `RoomService` | CRUD calls for rooms |
| `RequestService` | Handles group creation, join, and report requests |
| `UserService` | Profile fetch/update/delete |
| `AuditLogService` | Fetches Super Admin audit log entries |

### Models
`User`, `Group`, `Room`, `Message`, `GroupCreationRequest`, `JoinRequest`, `ReportRequest`, `AuditLogEntry` — TypeScript interfaces mirroring the backend schemas above.

## Proposed Server Endpoints: 
| Method | Route | Params/Body | Returns | Description |
|--------|-------|-------------|---------|--------------|
| POST | `/api/auth/signup` | `{ username, email, password, dob, theme }` | `{ user }` | Registers a new user |
| POST | `/api/auth/login` | `{ username, password }` | `{ token, user }` | Authenticates user |
| GET | `/api/users/:id` | — | `{ user }` | Fetch profile |
| PATCH | `/api/users/:id` | `{ username?, email?, password?, pfpUrl?, theme? }` | `{ user }` | Edit profile |
| DELETE | `/api/users/:id` | — | `204` | Delete account |
| GET | `/api/groups` | — | `Group[]` | Browse all approved groups |
| GET | `/api/groups/mine` | — | `{ favourites, adminOf, memberOf }` | My Groups data |
| POST | `/api/groups` | `{ name, description, ageLimit, theme }` | `{ groupCreationRequest }` | Submit group creation (pending SA approval) |
| PATCH | `/api/groups/:id` | `{ name?, description?, ageLimit?, theme? }` | `{ group }` | Edit group (Group Admin) |
| DELETE | `/api/groups/:id` | — | `204` | Delete group (Group Admin) |
| POST | `/api/groups/:id/favourite` | — | `{ favourited: boolean }` | Toggle favourite |
| POST | `/api/groups/:id/join` | — | `{ joinRequest }` | Request to join a group |
| GET | `/api/groups/:id/join-requests` | — (Group Admin) | `JoinRequest[]` | View pending join requests |
| PATCH | `/api/groups/:id/join-requests/:reqId` | `{ status }` | `{ joinRequest }` | Approve/deny join request |
| POST | `/api/groups/:id/rooms` | `{ name }` | `{ room }` | Create room |
| PATCH | `/api/groups/:id/rooms/:roomId` | `{ name }` | `{ room }` | Edit room |
| DELETE | `/api/groups/:id/rooms/:roomId` | — | `204` | Delete room |
| GET | `/api/groups/:id/rooms/:roomId/messages` | — | `Message[]` | Fetch message history |
| POST | `/api/reports` | `{ targetUserId, groupId?, reason }` | `{ reportRequest }` | Submit a report/ban request |
| GET | `/api/superadmin/group-requests` | — (Super Admin) | `GroupCreationRequest[]` | Pending group creation requests |
| PATCH | `/api/superadmin/group-requests/:id` | `{ status, rejectionReason? }` | `{ request }` | Approve/deny group creation |
| GET | `/api/superadmin/reports` | — (Super Admin) | `ReportRequest[]` | Pending ban/removal requests |
| PATCH | `/api/superadmin/reports/:id` | `{ status }` | `{ request }` | Approve/deny report |
| GET | `/api/superadmin/audit-log` | — (Super Admin) | `AuditLogEntry[]` | Full audit log |

## Design Documents and Storyboard: 
The wireframes and storyboards for Fabulari are located in the `/design_documents/` folder of this repository, covering the following:
    - Opening Screen
    - Login/Sign Up
    - Main Page
    - Profile
    - Group Page (with respective modals)
    - Request Page for Group Admin
    - Request Page for Super Admin
The storyboards show the navigation flow between these screens, including branching states such as underage rejection and join-request denial.
