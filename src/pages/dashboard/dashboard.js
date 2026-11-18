const STORAGE_KEY = "bugReports";

const sampleBugs = [
  {
    id: 101,
    title: "Login button not responding on Safari",
    project: "Student Management System",
    description: "The login button does not submit credentials in Safari 17 on macOS.",
    severity: "High",
    priority: "Critical",
    status: "Open",
    assignedTo: "Unassigned",
    createdDate: "2026-11-18"
  },
  {
    id: 102,
    title: "Dashboard chart overflows on mobile",
    project: "Analytics Portal",
    description: "The weekly activity chart extends beyond the viewport on smaller screens.",
    severity: "Medium",
    priority: "High",
    status: "In Progress",
    assignedTo: "Maya Chen",
    createdDate: "2026-11-17"
  },
  {
    id: 103,
    title: "Exported report has incorrect date format",
    project: "Student Management System",
    description: "CSV exports show dates in MM-DD-YYYY instead of the configured format.",
    severity: "Medium",
    priority: "Medium",
    status: "Fixed",
    assignedTo: "Noah Patel",
    createdDate: "2026-11-16"
  },
  {
    id: 104,
    title: "Password reset email arrives twice",
    project: "Customer Portal",
    description: "Submitting the reset form once sends two identical emails to the user.",
    severity: "Low",
    priority: "Low",
    status: "Open",
    assignedTo: "Unassigned",
    createdDate: "2026-11-15"
  },
  {
    id: 105,
    title: "Search results ignore the selected category",
    project: "Analytics Portal",
    description: "Search results include archived records even when the active category is selected.",
    severity: "High",
    priority: "High",
    status: "In Progress",
    assignedTo: "Ava Rodriguez",
    createdDate: "2026-11-14"
  },
  {
    id: 106,
    title: "Profile avatar is missing after sign-in",
    project: "Customer Portal",
    description: "The default avatar is shown until the user reloads the profile page.",
    severity: "Low",
    priority: "Medium",
    status: "Closed",
    assignedTo: "Liam Brooks",
    createdDate: "2026-11-13"
  }
];

const elements = {
  totalBugs: document.getElementById("totalBugs"),
  openBugs: document.getElementById("openBugs"),
  inProgressBugs: document.getElementById("inProgressBugs"),
  fixedBugs: document.getElementById("fixedBugs"),
  tableBody: document.getElementById("bugTableBody"),
  resultsSummary: document.getElementById("resultsSummary"),
  globalSearch: document.getElementById("globalSearch"),
  tableSearch: document.getElementById("tableSearch"),
  statusFilter: document.getElementById("statusFilter"),
  activityList: document.getElementById("activityList"),
  bugDialog: document.getElementById("bugDialog"),
  dialogBugId: document.getElementById("dialogBugId"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogBody: document.getElementById("dialogBody"),
  toast: document.getElementById("toast"),
  sidebar: document.getElementById("sidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  menuToggle: document.getElementById("menuToggle"),
  notificationToggle: document.getElementById("notificationToggle"),
  notificationPanel: document.getElementById("notificationPanel"),
  profileToggle: document.getElementById("profileToggle"),
  profileMenu: document.getElementById("profileMenu")
};

let bugs = loadBugReports();
let toastTimeout;

function loadBugReports() {
  let savedReports;

  try {
    savedReports = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    showToast("Browser storage is unavailable. Sample reports are shown for this session.", true);
    return [...sampleBugs];
  }

  if (savedReports === null) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBugs));
      return [...sampleBugs];
    } catch (error) {
      showToast("Could not save sample reports. They are shown for this session only.", true);
      return [...sampleBugs];
    }
  }

  try {
    const parsedReports = JSON.parse(savedReports);
    if (!Array.isArray(parsedReports)) {
      throw new TypeError("Bug reports must be stored as an array.");
    }
    return parsedReports;
  } catch (error) {
    showToast("Saved bug reports could not be read. Check the bugReports data in localStorage.", true);
    return [];
  }
}

function showToast(message, isError) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", Boolean(isError));
  elements.toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 4200);
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function getStatusClass(status) {
  const normalizedStatus = normalizeText(status);
  if (normalizedStatus === "in progress") return "status-in-progress";
  if (normalizedStatus === "fixed") return "status-fixed";
  if (normalizedStatus === "closed") return "status-closed";
  return "status-open";
}

function getPriorityClass(priority) {
  const normalizedPriority = normalizeText(priority);
  if (normalizedPriority === "critical") return "priority-critical";
  if (normalizedPriority === "high") return "priority-high";
  if (normalizedPriority === "medium") return "priority-medium";
  return "priority-low";
}

function getSeverityClass(severity) {
  const normalizedSeverity = normalizeText(severity);
  if (normalizedSeverity === "critical") return "severity-critical";
  if (normalizedSeverity === "high") return "severity-high";
  if (normalizedSeverity === "medium") return "severity-medium";
  return "severity-low";
}

function formatDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHTML(dateValue);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function getBugTimestamp(bug) {
  const timestamp = new Date(`${bug.createdDate || ""}T00:00:00`).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getPriorityCount(priority) {
  return bugs.filter((bug) => normalizeText(bug.priority) === normalizeText(priority)).length;
}

function renderStatistics() {
  elements.totalBugs.textContent = bugs.length;
  elements.openBugs.textContent = bugs.filter((bug) => normalizeText(bug.status) === "open").length;
  elements.inProgressBugs.textContent = bugs.filter((bug) => normalizeText(bug.status) === "in progress").length;
  elements.fixedBugs.textContent = bugs.filter((bug) => normalizeText(bug.status) === "fixed").length;

  const priorities = [
    { name: "Critical", countId: "criticalCount", barId: "criticalBar" },
    { name: "High", countId: "highCount", barId: "highBar" },
    { name: "Medium", countId: "mediumCount", barId: "mediumBar" },
    { name: "Low", countId: "lowCount", barId: "lowBar" }
  ];

  priorities.forEach(({ name, countId, barId }) => {
    const count = getPriorityCount(name);
    const countElement = document.getElementById(countId);
    const barElement = document.getElementById(barId);
    countElement.textContent = count;
    barElement.style.width = `${bugs.length ? (count / bugs.length) * 100 : 0}%`;
  });
}

function getFilteredBugs() {
  const searchTerm = normalizeText(elements.tableSearch.value);
  const selectedStatus = normalizeText(elements.statusFilter.value);

  return [...bugs]
    .filter((bug) => {
      const matchesSearch = !searchTerm
        || normalizeText(bug.id).includes(searchTerm)
        || normalizeText(bug.title).includes(searchTerm);
      const matchesStatus = selectedStatus === "all"
        || normalizeText(bug.status) === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((first, second) => getBugTimestamp(second) - getBugTimestamp(first));
}

function renderBugTable() {
  const filteredBugs = getFilteredBugs();
  elements.resultsSummary.textContent = `Showing ${filteredBugs.length} of ${bugs.length} report${bugs.length === 1 ? "" : "s"}`;

  if (!filteredBugs.length) {
    const message = bugs.length
      ? "No bug reports match your search or filter."
      : "No bug reports yet. Reports added by your team will appear here.";
    elements.tableBody.innerHTML = `<tr><td class="empty-cell" colspan="9">${message}</td></tr>`;
    return;
  }

  elements.tableBody.innerHTML = filteredBugs.map((bug) => `
    <tr>
      <td><span class="bug-id">#${escapeHTML(bug.id)}</span></td>
      <td><div class="bug-title" title="${escapeHTML(bug.title)}">${escapeHTML(bug.title || "Untitled bug")}</div></td>
      <td><div class="project-cell" title="${escapeHTML(bug.project)}">${escapeHTML(bug.project || "—")}</div></td>
      <td><span class="severity-pill ${getSeverityClass(bug.severity)}">${escapeHTML(bug.severity || "—")}</span></td>
      <td><span class="priority-pill ${getPriorityClass(bug.priority)}">${escapeHTML(bug.priority || "—")}</span></td>
      <td class="assigned-cell">${escapeHTML(bug.assignedTo || "Unassigned")}</td>
      <td><span class="status-pill ${getStatusClass(bug.status)}">${escapeHTML(bug.status || "Open")}</span></td>
      <td class="date-cell">${formatDate(bug.createdDate)}</td>
      <td><button class="row-action" type="button" data-bug-id="${escapeHTML(bug.id)}">View</button></td>
    </tr>
  `).join("");
}

function formatRelativeDate(dateValue) {
  if (!dateValue) return "Recently";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Recently";

  const daysAgo = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  return formatDate(dateValue);
}

function getActivityForBug(bug) {
  const status = normalizeText(bug.status);
  if (status === "in progress") {
    return {
      type: "assigned",
      icon: "↗",
      message: `assigned to <strong>${escapeHTML(bug.assignedTo || "a developer")}</strong>`,
      suffix: `<span> · #${escapeHTML(bug.id)}</span>`
    };
  }
  if (status === "fixed") {
    return {
      type: "fixed",
      icon: "✓",
      message: "marked as fixed",
      suffix: `<span> · #${escapeHTML(bug.id)}</span>`
    };
  }
  if (status === "closed") {
    return {
      type: "fixed",
      icon: "✓",
      message: "closed",
      suffix: `<span> · #${escapeHTML(bug.id)}</span>`
    };
  }
  return {
    type: "reported",
    icon: "+",
    message: "new bug reported",
    suffix: `<span> · #${escapeHTML(bug.id)}</span>`
  };
}

function renderActivity() {
  const recentBugs = [...bugs]
    .sort((first, second) => getBugTimestamp(second) - getBugTimestamp(first))
    .slice(0, 4);

  if (!recentBugs.length) {
    elements.activityList.innerHTML = '<div class="activity-empty">Activity will show here when bugs are reported.</div>';
    return;
  }

  elements.activityList.innerHTML = recentBugs.map((bug) => {
    const activity = getActivityForBug(bug);
    return `
      <div class="activity-item">
        <span class="activity-icon ${activity.type}" aria-hidden="true">${activity.icon}</span>
        <div class="activity-copy"><strong>${escapeHTML(bug.title || "Untitled bug")}</strong> ${activity.message}${activity.suffix}</div>
        <span class="activity-time">${formatRelativeDate(bug.createdDate)}</span>
      </div>
    `;
  }).join("");
}

function renderDashboard() {
  renderStatistics();
  renderBugTable();
  renderActivity();
}

function openBugDetails(bugId) {
  const bug = bugs.find((item) => String(item.id) === String(bugId));
  if (!bug) {
    showToast("That bug report is no longer available. Refresh the dashboard and try again.", true);
    return;
  }

  elements.dialogBugId.textContent = `BUG #${bug.id}`;
  elements.dialogTitle.textContent = bug.title || "Untitled bug";

  const details = [
    ["Project", bug.project || "—", false],
    ["Assigned to", bug.assignedTo || "Unassigned", false],
    ["Severity", bug.severity || "—", false],
    ["Priority", bug.priority || "—", false],
    ["Status", bug.status || "Open", false],
    ["Reported", formatDate(bug.createdDate), false],
    ["Description", bug.description || "No description provided.", true]
  ];

  elements.dialogBody.innerHTML = details.map(([label, value, isFullWidth]) => `
    <div class="detail-item${isFullWidth ? " detail-full" : ""}">
      <span class="detail-label">${escapeHTML(label)}</span>
      <div class="detail-value">${escapeHTML(value)}</div>
    </div>
  `).join("");

  elements.bugDialog.showModal();
}

function setSidebarOpen(isOpen) {
  elements.sidebar.classList.toggle("is-open", isOpen);
  elements.sidebarBackdrop.hidden = !isOpen;
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
  elements.menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

function closePopovers(except) {
  [
    { button: elements.notificationToggle, panel: elements.notificationPanel },
    { button: elements.profileToggle, panel: elements.profileMenu }
  ].forEach(({ button, panel }) => {
    if (panel !== except) {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function togglePopover(button, panel) {
  const willOpen = panel.hidden;
  closePopovers(panel);
  panel.hidden = !willOpen;
  button.setAttribute("aria-expanded", String(willOpen));
}

function refreshFromStorage() {
  bugs = loadBugReports();
  renderDashboard();
}

elements.globalSearch.addEventListener("input", () => {
  elements.tableSearch.value = elements.globalSearch.value;
  renderBugTable();
});

elements.tableSearch.addEventListener("input", () => {
  elements.globalSearch.value = elements.tableSearch.value;
  renderBugTable();
});

elements.statusFilter.addEventListener("change", renderBugTable);

elements.tableBody.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-bug-id]");
  if (viewButton) openBugDetails(viewButton.dataset.bugId);
});

document.getElementById("dialogClose").addEventListener("click", () => elements.bugDialog.close());
document.getElementById("dialogDone").addEventListener("click", () => elements.bugDialog.close());
document.getElementById("activityRefresh").addEventListener("click", refreshFromStorage);

elements.menuToggle.addEventListener("click", () => {
  setSidebarOpen(!elements.sidebar.classList.contains("is-open"));
});
elements.sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
elements.sidebar.addEventListener("click", (event) => {
  if (event.target.closest("a")) setSidebarOpen(false);
});

elements.notificationToggle.addEventListener("click", () => {
  togglePopover(elements.notificationToggle, elements.notificationPanel);
});
elements.profileToggle.addEventListener("click", () => {
  togglePopover(elements.profileToggle, elements.profileMenu);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".popover-wrap")) closePopovers();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.globalSearch.focus();
  }
  if (event.key === "Escape") {
    setSidebarOpen(false);
    closePopovers();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY || event.key === null) refreshFromStorage();
});
window.addEventListener("focus", refreshFromStorage);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshFromStorage();
});

renderDashboard();