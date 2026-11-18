
(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'bugflow_reports_v2';

  let editingId = null;
  let toastTimer;

  const today = () => new Date().toLocaleDateString('en-GB');

  function reports() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveReports(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      toast('Unable to save. Browser storage may be full.');
      return false;
    }
  }

  function nextId() {
    const date = new Date().toISOString()
      .slice(0, 10).replaceAll('-', '');

    const prefix = `BUG-${date}-`;

    const numbers = reports()
      .filter(r => String(r.id).startsWith(prefix))
      .map(r => Number(String(r.id).split('-').pop()))
      .filter(Number.isFinite);

    const next = Math.max(0, ...numbers) + 1;

    return prefix + String(next).padStart(3, '0');
  }

  function refreshId() {
    $('bugId').value = nextId();
  }

  function toast(message) {
    const t = $('toast');
    t.textContent = message;
    t.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      t.classList.remove('show');
    }, 3000);
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function statusClass(status) {
    return String(status).toLowerCase().replace(/\s+/g, '-');
  }

  function updateDashboard() {
    const all = reports();

    $('totalCount').textContent = all.length;
    $('openCount').textContent =
      all.filter(r => r.status === 'Open').length;
    $('progressCount').textContent =
      all.filter(r => r.status === 'In Progress').length;
    $('resolvedCount').textContent =
      all.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;

    const statuses = [
      'Open',
      'In Progress',
      'Resolved',
      'Closed'
    ];

    $('statusOverview').innerHTML = statuses.map(status => {
      const count = all.filter(r => r.status === status).length;

      return `
        <div class="status-item">
          <span>${esc(status)}</span>
          <b>${count}</b>
        </div>
      `;
    }).join('');
  }

  function render() {
    const department = $('departmentFilter').value;
    const query = $('searchInput').value.trim().toLowerCase();

    const list = reports().filter(r => {
      const matchesDepartment =
        !department || r.department === department;

      const searchable = [
        r.id, r.title, r.module, r.department,
        r.status, r.severity, r.priority,
        r.reporter, r.description, r.actual
      ].join(' ').toLowerCase();

      return matchesDepartment &&
        (!query || searchable.includes(query));
    });

    $('bugsTable').innerHTML = list.length
      ? list.slice().reverse().map(r => `
        <tr>
          <td><b>${esc(r.id)}</b></td>
          <td>${esc(r.title)}</td>
          <td>${esc(r.module)}</td>
          <td class="severity-${esc(r.severity).toLowerCase()}">
            ${esc(r.severity)}
          </td>
          <td>${esc(r.priority)}</td>
          <td>${esc(r.department)}</td>
          <td>
            <select class="status-select"
              data-action="status" data-id="${esc(r.id)}">
              ${['Open', 'In Progress', 'Resolved', 'Closed'].map(s =>
                `<option ${r.status === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </td>
          <td>${esc(r.date)}</td>
          <td>
            <button class="action-btn edit-btn"
              data-action="edit" data-id="${esc(r.id)}">
              Edit
            </button>
            <button class="action-btn delete-btn"
              data-action="delete" data-id="${esc(r.id)}">
              Delete
            </button>
          </td>
        </tr>
      `).join('')
      : `<tr class="empty">
          <td colspan="9">No matching bug reports found.</td>
        </tr>`;

    updateDashboard();
  }

  function validFile(file) {
    if (!file) return true;

    const allowed = [
      'image/png',
      'image/jpeg',
      'application/pdf'
    ];

    if (!allowed.includes(file.type)) {
      toast('Choose PNG, JPG, JPEG or PDF.');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('File size must be 5 MB or less.');
      return false;
    }

    return true;
  }

  function resetFormState() {
    editingId = null;
    $('submitBtn').textContent = '➤ Submit Bug Report →';
    $('status').value = 'Open';
    $('reportedDate').value = today();
    $('fileName').textContent = '';
    $('bugReference').textContent =
      'Generated automatically on submission';

    refreshId();
  }

  function clearForm() {
    if (!confirm('Are you sure you want to clear the form?')) {
      return;
    }

    $('bugForm').reset();
    resetFormState();
    toast('Form cleared.');
  }

  // FILE SELECTION
  $('attachment').addEventListener('change', event => {
    const file = event.target.files[0];

    if (!validFile(file)) {
      event.target.value = '';
      $('fileName').textContent = '';
      return;
    }

    $('fileName').textContent =
      file ? `Selected: ${file.name}` : '';
  });

  // DRAG AND DROP
  const upload = $('uploadArea');

  ['dragenter', 'dragover'].forEach(type => {
    upload.addEventListener(type, event => {
      event.preventDefault();
      upload.classList.add('dragging');
    });
  });

  ['dragleave', 'drop'].forEach(type => {
    upload.addEventListener(type, event => {
      event.preventDefault();
      upload.classList.remove('dragging');
    });
  });

  upload.addEventListener('drop', event => {
    const file = event.dataTransfer.files[0];

    if (!file || !validFile(file)) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    $('attachment').files = transfer.files;

    $('fileName').textContent = `Selected: ${file.name}`;
  });

  // COPY BUG ID
  $('copyId').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('bugId').value);
      toast('Bug ID copied successfully.');
    } catch {
      $('bugId').select();
      toast('Select and copy the Bug ID manually.');
    }
  });

  // SUBMIT AND UPDATE
  $('bugForm').addEventListener('submit', event => {
    event.preventDefault();

    const form = $('bugForm');

    if (!form.reportValidity()) {
      toast('Please complete all required fields.');
      return;
    }

    const requiredText = [
      ['title', 'Bug title'],
      ['description', 'Bug description'],
      ['steps', 'Steps to reproduce'],
      ['expected', 'Expected result'],
      ['actual', 'Actual result'],
      ['reporter', 'Reporter name']
    ];

    for (const [id, label] of requiredText) {
      if (!$ (id).value.trim()) {
        toast(`${label} cannot be empty.`);
        $(id).focus();
        return;
      }
    }

    const file = $('attachment').files[0];

    if (!validFile(file)) return;

    const all = reports();

    const oldReport = editingId
      ? all.find(r => r.id === editingId)
      : null;

    const report = {
      id: editingId || $('bugId').value,
      status: $('status').value,
      title: $('title').value.trim(),
      module: $('module').value,
      department: $('department').value,
      severity: $('severity').value,
      priority: $('priority').value,
      description: $('description').value.trim(),
      steps: $('steps').value.trim(),
      expected: $('expected').value.trim(),
      actual: $('actual').value.trim(),
      browser: $('browser').value,
      os: $('os').value,
      device: $('device').value,
      environment: $('environment').value,
      reporter: $('reporter').value.trim(),
      date: oldReport ? oldReport.date : today(),
      attachmentName: file
        ? file.name
        : (oldReport ? oldReport.attachmentName : '')
    };

    if (editingId) {
      const index = all.findIndex(r => r.id === editingId);

      if (index === -1) {
        toast('Report not found.');
        return;
      }

      all[index] = report;
    } else {
      all.push(report);
    }

    if (!saveReports(all)) return;

    const wasEditing = Boolean(editingId);

    $('bugReference').textContent = report.id;

    render();

    toast(wasEditing
      ? 'Bug report updated successfully.'
      : `Bug report ${report.id} submitted successfully.`
    );

    $('bugForm').reset();
    resetFormState();
  });

  // CANCEL FORM RESET
  $('bugForm').addEventListener('reset', () => {
    setTimeout(() => {
      if (!editingId) resetFormState();
    }, 0);
  });

  // TABLE ACTIONS
  $('bugsTable').addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'edit') {
      editReport(id);
    }

    if (action === 'delete') {
      deleteReport(id);
    }
  });

  // STATUS CHANGE
  $('bugsTable').addEventListener('change', event => {
    const select = event.target.closest('select[data-action="status"]');
    if (!select) return;

    const all = reports();
    const report = all.find(r => r.id === select.dataset.id);

    if (!report) return;

    report.status = select.value;

    if (saveReports(all)) {
      render();
      toast('Bug status updated.');
    }
  });

  // EDIT REPORT
  function editReport(id) {
    const report = reports().find(r => r.id === id);

    if (!report) {
      toast('Bug report not found.');
      return;
    }

    editingId = id;

    const fields = [
      'bugId', 'status', 'title', 'module', 'department',
      'severity', 'priority', 'description', 'steps',
      'expected', 'actual', 'browser', 'os', 'device',
      'environment', 'reporter'
    ];

    fields.forEach(key => {
      if ($(key)) {
        const value = key === 'bugId' ? report.id : report[key];
        $(key).value = value || '';
      }
    });

    $('reportedDate').value = report.date;
    $('bugReference').textContent = report.id;
    $('fileName').textContent = report.attachmentName
      ? `Previously attached: ${report.attachmentName}`
      : '';

    $('submitBtn').textContent = 'Save Changes →';

    $('report').scrollIntoView({ behavior: 'smooth' });
    toast('Editing bug report ' + id);
  }

  // DELETE REPORT
  function deleteReport(id) {
    if (!confirm(`Are you sure you want to delete ${id}?`)) {
      return;
    }

    const all = reports().filter(r => r.id !== id);

    if (!saveReports(all)) return;

    if (editingId === id) {
      $('bugForm').reset();
      resetFormState();
    }

    render();
    toast('Bug report deleted.');
  }

  // SEARCH AND FILTER
  $('departmentFilter').addEventListener('change', render);
  $('searchInput').addEventListener('input', render);

  // SIDEBAR
  $('menuToggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
  });

  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
      $('sidebar').classList.remove('open');

      document.querySelectorAll('.sidebar nav a')
        .forEach(a => a.classList.remove('active'));

      link.classList.add('active');
    });
  });

  document.addEventListener('click', event => {
    if (
      window.innerWidth <= 700 &&
      $('sidebar').classList.contains('open') &&
      !$('sidebar').contains(event.target) &&
      !$('menuToggle').contains(event.target)
    ) {
      $('sidebar').classList.remove('open');
    }
  });

  // INITIALIZE
  $('reportedDate').value = today();
  refreshId();
  render();

})();
