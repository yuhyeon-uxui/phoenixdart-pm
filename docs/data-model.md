# PhoenixDart Workflow PM
## Data Model Draft v1

## Purpose
This document defines the core data structure for the MVP of PhoenixDart Workflow PM.

The MVP uses six main entities:

- Project
- Task
- Handoff
- QA Issue
- Activity Log
- User / Team

## Relationship Summary

- One project has many tasks.
- One project has many handoffs.
- One project has many QA issues.
- One project has many activity logs.
- One team has many users.
- One user can be assigned to many tasks, issues, and handoff steps.

## Project

Top-level entity for a project. It stores project metadata, current stage, progress, and open status.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Unique project ID | `proj_001` |
| name | string | Y | Project name | `Spring Promotion Landing` |
| description | text | N | Project description | `Landing page update for seasonal promotion` |
| projectType | enum | Y | Project type | `Promotion` |
| operationType | enum | Y | Operation type | `Recurring` |
| status | enum | Y | Project progress status | `In Progress` |
| openStatus | enum | Y | Service open status | `Before Open` |
| priority | enum | N | Project priority | `Medium` |
| ownerUserId | string | Y | Project owner ID | `user_001` |
| ownerTeamId | string | N | Owner team ID | `team_ops` |
| currentStage | enum | Y | Current workflow stage | `Development` |
| nextTeamId | string | N | Next handoff target team | `team_qa` |
| progress | number | Y | Progress percentage | `40` |
| startDate | date | N | Start date | `2026-05-01` |
| endDate | date | N | End date | `2026-05-31` |
| createdAt | datetime | Y | Created timestamp | `2026-05-19T10:00:00+09:00` |
| updatedAt | datetime | Y | Updated timestamp | `2026-05-19T14:20:00+09:00` |

### Suggested Enums

- `projectType`
  - New Service
  - Operations Improvement
  - Event
  - Promotion

- `operationType`
  - One-time
  - Recurring
  - Always-on

- `status`
  - Planned
  - In Progress
  - QA In Progress
  - Ready for Release
  - Live
  - Closed

- `openStatus`
  - Before Open
  - Internal Open
  - Full Open
  - Operation Closed

## Task

Execution unit inside a project. This is the source of truth for MVP progress calculation.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Unique task ID | `task_001` |
| projectId | string | Y | Parent project ID | `proj_001` |
| title | string | Y | Task title | `Create release checklist` |
| description | text | N | Task description | `Document required checks before deployment` |
| status | enum | Y | Task status | `In Progress` |
| assigneeUserId | string | N | Assignee ID | `user_013` |
| assigneeTeamId | string | N | Assignee team ID | `team_ops` |
| startDate | date | N | Start date | `2026-05-20` |
| dueDate | date | N | Due date | `2026-05-25` |
| priority | enum | N | Priority | `High` |
| sortOrder | number | N | Optional ordering value | `1` |
| createdAt | datetime | Y | Created timestamp | `2026-05-19T10:10:00+09:00` |
| updatedAt | datetime | Y | Updated timestamp | `2026-05-19T11:40:00+09:00` |

### Task Status

- Planned
- In Progress
- QA
- Done

### Task Priority

- High
- Medium
- Low

### MVP Progress Formula

`completed tasks / total tasks * 100`

- Only tasks with status `Done` are counted as completed.
- If total tasks is `0`, progress is `0%`.

## Handoff

Core entity for cross-team transfer, confirmation, and ETA response.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Unique handoff ID | `handoff_001` |
| projectId | string | Y | Parent project ID | `proj_001` |
| stageName | enum | Y | Stage name | `Design QA` |
| fromTeamId | string | N | Sender team ID | `team_design` |
| toTeamId | string | Y | Receiver team ID | `team_dev` |
| ownerUserId | string | N | Current stage owner ID | `user_021` |
| status | enum | Y | Handoff status | `Confirmed` |
| isDelivered | boolean | Y | Whether sent to next team | `true` |
| deliveredAt | datetime | N | Delivery timestamp | `2026-05-19T13:00:00+09:00` |
| isConfirmed | boolean | Y | Whether next team confirmed | `true` |
| confirmedAt | datetime | N | Confirmation timestamp | `2026-05-19T14:00:00+09:00` |
| etaDate | date | N | Estimated completion date | `2026-05-24` |
| isEtaSubmitted | boolean | Y | Whether ETA was submitted | `true` |
| etaSubmittedAt | datetime | N | ETA submitted timestamp | `2026-05-19T14:10:00+09:00` |
| isCompleted | boolean | Y | Whether this stage is complete | `false` |
| completedAt | datetime | N | Completion timestamp | `null` |
| note | text | N | Handoff memo | `Recheck after QA fix` |
| createdAt | datetime | Y | Created timestamp | `2026-05-19T13:00:00+09:00` |
| updatedAt | datetime | Y | Updated timestamp | `2026-05-19T14:10:00+09:00` |

### Stage Name Examples

- Design
- Development
- Design QA
- Localization
- Final Review
- Release
- Operations Handoff

### Handoff Status Examples

- Not Sent
- Delivered
- Confirmed
- ETA Submitted
- In Progress
- Completed

## QA Issue

Tracks QA and bug issues found during review and testing.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Unique QA issue ID | `qa_001` |
| projectId | string | Y | Parent project ID | `proj_001` |
| taskId | string | N | Related task ID | `task_003` |
| title | string | Y | Issue title | `Button text wraps in JP locale` |
| description | text | N | Issue description | `The CTA overflows in Japanese and English` |
| assigneeUserId | string | N | Assignee ID | `user_031` |
| assigneeTeamId | string | N | Assignee team ID | `team_qa` |
| severity | enum | Y | Issue severity | `Medium` |
| status | enum | Y | QA issue status | `Retest In Progress` |
| createdDate | date | Y | Created date | `2026-05-19` |
| resolvedAt | datetime | N | Resolved timestamp | `null` |
| createdAt | datetime | Y | Created timestamp | `2026-05-19T15:10:00+09:00` |
| updatedAt | datetime | Y | Updated timestamp | `2026-05-19T17:00:00+09:00` |

### Severity

- High
- Medium
- Low

### QA Status Examples

- Before Test
- Testing
- Fix In Progress
- Retest In Progress
- QA Done
- Failed
- Rejected

## Activity Log

Project-level audit trail for major actions.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Unique log ID | `log_001` |
| projectId | string | Y | Parent project ID | `proj_001` |
| actorUserId | string | N | Actor user ID | `user_001` |
| actorName | string | Y | Actor display name | `Jihun Kim` |
| actionType | enum | Y | Action type | `task_completed` |
| targetType | enum | Y | Target entity type | `task` |
| targetId | string | N | Target entity ID | `task_001` |
| message | string | Y | Visible message | `Task marked as completed.` |
| createdAt | datetime | Y | Event timestamp | `2026-05-19T16:20:00+09:00` |

### Action Type Examples

- project_created
- task_created
- task_updated
- task_completed
- handoff_sent
- handoff_confirmed
- eta_submitted
- qa_issue_created
- qa_issue_updated
- release_done
- open_status_changed

## User

Represents a person using the system. MVP keeps this simple.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | User ID | `user_001` |
| name | string | Y | Display name | `Jihun Kim` |
| email | string | N | Email | `jihun@phoenixdart.com` |
| teamId | string | N | Team ID | `team_ops` |
| role | enum | N | Role | `project_owner` |
| isActive | boolean | Y | Active flag | `true` |

### Role Examples

- project_owner
- team_member
- qa_owner
- reviewer
- viewer

## Team

Represents a team unit used in handoff workflows.

| Field | Type | Required | Description | Example |
| --- | --- | --- | --- | --- |
| id | string | Y | Team ID | `team_design` |
| name | string | Y | Team name | `Design Team` |
| code | string | N | Team code | `DESIGN` |
| description | text | N | Team description | `Owns product design and design QA` |

## MVP Schema Summary

- Project 1 : N Task
- Project 1 : N Handoff
- Project 1 : N QA Issue
- Project 1 : N Activity Log
- Team 1 : N User
- Team 1 : N Handoff
- User 1 : N Task
- User 1 : N QA Issue

## Future Extensions

- recurring project templates
- SLA by team
- approval workflows
- notifications and reminders
- external integrations
- file attachments
- comments and mentions
- weighted progress metrics
- launch readiness checklist
