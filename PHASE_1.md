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
Y 

## Angular Architecture: 
Y 

## Proposed Server Endpoints: 
Y 

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
