# BugTrack

BugTrack is a collaborative bug-tracking web application prototype built with HTML, CSS, and JavaScript.

## Features

- Search bugs by ID or title
- Filter bugs by status, severity, and assignee
- View complete bug details
- Assign developers and update bug status
- Add comments or fix notes
- View status history
- Delete bugs with confirmation
- Responsive BugTrack dashboard layout
- Sample data for 20 bugs

## Main Pages

| Page | Folder | Description |
|---|---|---|
| Manage Bugs | `src/pages/manage-bugs` | Search, filter, view, edit, update, and delete bug reports |
| Bug Status | `src/pages/bug-status` | Monitor all bug statuses and update assignment or progress |

Shared sample bug data is stored in:

```text
src/data/bugs.js
```

## Technologies

- HTML5
- CSS3
- JavaScript
- Python local HTTP server for development preview
- Git and GitHub

## Run Locally

From the project root, start a local server:

```bash
python -m http.server 4174
```

Open:

- <http://localhost:4174/src/pages/manage-bugs/index.html>
- <http://localhost:4174/src/pages/bug-status/index.html>

## Project Structure

```text
Bug-Track/
├── README.md
├── LICENSE
└── src/
    ├── data/
    │   └── bugs.js
    └── pages/
        ├── manage-bugs/
        │   ├── index.html
        │   ├── styles.css
        │   └── app.js
        └── bug-status/
            ├── index.html
            ├── styles.css
            └── app.js
```

## Manage Bugs Page

The Manage Bugs page displays bug ID, title, module, severity, status, assignee, reporter, and reported date. It supports:

- Bug ID or title search
- Status filtering
- Severity filtering
- Developer/assignee filtering
- Clearing filters
- Opening the Bug Status page
- Delete confirmation

## Bug Status Page

The Bug Status page provides:

- Status summary counts
- Search and status filtering
- A complete bug status table
- Developer assignment
- Workflow status selection
- Fix comments or notes
- Reproduction and result details
- Status history

## Data Behavior

This is a front-end prototype. Bug records are stored in JavaScript memory and reset when the page is refreshed. No database or backend API is currently connected.

## GitHub Group Workflow

Every contributor should work on a separate branch:

```bash
git switch main
git pull origin main
git switch -c feature/your-feature-name
```

Add your changes:

```bash
git add .
git commit -m "Add your feature description"
git push -u origin feature/your-feature-name
```

Create a Pull Request on GitHub, request review from the team, resolve conflicts, and merge it into `main`.

Do not overwrite other contributors' folders.

## Contributor Scope

The Manage Bugs and Bug Status implementations belong to:

- `src/pages/manage-bugs`
- `src/pages/bug-status`
- Shared bug data in `src/data/bugs.js`

## Future Improvements

- Backend API and database
- Persistent login and authentication
- Team member management
- File attachments
- Notifications
- Advanced sorting and pagination