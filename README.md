# BugTrack

BugTrack is a collaborative bug-tracking web application prototype built with HTML, CSS, and JavaScript. It provides testers and developers with one interface for reporting, reviewing, assigning, and tracking software defects.

The project demonstrates a complete bug-management workflow:

**Report Bug → Manage Bugs → Assign Developer → Update Status → Add Resolution Note → Close or Reopen**

This frontend prototype uses shared JavaScript sample data and does not require a backend or database. Bug changes are stored in browser memory and are reset when the page is refreshed.

## Features

- Search bugs by bug ID or title
- Filter bugs by status, severity, and assignee
- View complete bug details
- Assign a developer to a bug
- Update bug status through a defined workflow
- Add fix comments and resolution notes
- View status history and recent updates
- Delete bugs with a confirmation dialog
- Responsive desktop and mobile layout
- Sample data for 20 bugs
- Shared bug data between application pages
- Clear navigation between bug-management views
- Modern dashboard interface with severity and status indicators

## Main Pages

| Page | Folder | Description |
|---|---|---|
| Report a Bug | `src/pages/report-bug` | Submit new bug reports with reproduction and environment details |
| Manage Bugs | `src/pages/manage-bugs` | Search, filter, view, edit, update, and delete bug reports |
| Bug Status | `src/pages/bug-status` | Monitor bug statuses and update assignment or progress |

## Bug Workflow

```text
Open
  ↓
Assigned
  ↓
In Progress
  ↓
Resolved
  ↓
Retest
  ├── Closed
  └── Reopened
          ↓
      In Progress
