'use strict';

/* ==========================================================================
   SECTION 01: APPLICATION STATE & SECURITY UTILITIES
   ========================================================================== */
let store = {
  residents: [],
  zones: [],
  sources: [],
  schedules: [],
  allocation: [],
  personnel: [],
  announcements: [],
  reports: [],
  requests: [],
  logs: [],
  settings: null
};

let refreshVersion = 0;
let activeTab = 'dashboard';
let currentEditId = null;
let currentRevision = null;
let currentModule = '';
let modalTrigger = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function getBadgeClass(status) {
  switch (status) {
    case 'Normal':
    case 'Published':
    case 'Recorded':
    case 'Resolved':
    case 'Active':
    case 'Completed':
    case 'Approved':
    case 'Fulfilled':
      return 'badge-success';
    case 'Under Review':
    case 'Low Supply':
    case 'Scheduled':
    case 'Pending':
    case 'Submitted':
      return 'badge-warning';
    case 'Ongoing':
    case 'Action Taken':
      return 'badge-info';
    case 'Interrupted':
    case 'Cancelled':
    case 'Rejected':
      return 'badge-danger';
    default:
      return 'badge-warning';
  }
}

/* ==========================================================================
   SECTION 02: SIDEBAR NAVIGATION & TAB SWITCHING
   ========================================================================== */
function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.view-pane').forEach(el => el.classList.remove('active'));

  const targetNav = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (targetNav) targetNav.classList.add('active');

  const targetPane = document.getElementById(`view-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  const titleMap = {
    dashboard: 'Dashboard',
    residents: 'Residents Management',
    zones: 'Barangay & Zone Management',
    sources: 'Water Source Monitoring',
    schedules: 'Water Distribution Schedules',
    allocation: 'Water Allocation Records',
    personnel: 'Distribution Personnel',
    announcements: 'Announcements & Advisories',
    reports: 'Water Reports & Complaints',
    requests: 'Water Requests',
    analytics: 'Analytics & Reports',
    history: 'Records History',
    logs: 'Activity Logs',
    settings: 'System Settings'
  };
  document.getElementById('page-title').innerText = titleMap[tabId] || 'Dashboard';

  const tableModules = [
    'residents', 'zones', 'sources', 'schedules',
    'allocation', 'personnel', 'announcements', 'reports', 'requests'
  ];
  if (tableModules.includes(tabId)) {
    renderTable(tabId);
  }
  refreshAdminData();
}
/* END SECTION 02: SIDEBAR NAVIGATION & TAB SWITCHING */

/* ==========================================================================
   SECTION 03: TOP HEADER DATE & DASHBOARD OVERVIEW RENDERING
   ========================================================================== */
function syncCurrentDate() {
  const badgeSpan = document.querySelector('.date-badge span');
  if (badgeSpan) {
    badgeSpan.textContent = new Date().toLocaleDateString('en-PH', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

function updateDashboardData() {
  document.getElementById('dash-stat-residents').innerText = store.residents.length;
  document.getElementById('dash-stat-schedules').innerText = store.schedules.length;
  document.getElementById('dash-stat-reports').innerText = store.reports.filter(r => r.status !== 'Resolved').length;
  document.getElementById('dash-stat-announcements').innerText = store.announcements.length;

  // Latest Community Reports Widget
  const reportsContainer = document.getElementById('dash-latest-reports-container');
  if (store.reports.length === 0) {
    reportsContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">No reports submitted.</p>`;
  } else {
    const top = store.reports[0];
    reportsContainer.innerHTML = `
      <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="list-item-info">
          <h5 style="font-size:13.5px; font-weight:600;">${escapeHtml(top.title)}</h5>
          <p style="font-size:11.5px; color:#94a3b8;">${escapeHtml(top.area)} · ${escapeHtml(top.date)}</p>
        </div>
        <span class="badge ${getBadgeClass(top.status)}">${escapeHtml(top.status)}</span>
      </div>`;
  }

  // Latest Announcements Widget
  const annContainer = document.getElementById('dash-latest-announcements-container');
  if (store.announcements.length === 0) {
    annContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">No announcements published.</p>`;
  } else {
    const top = store.announcements[0];
    annContainer.innerHTML = `
      <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="list-item-info">
          <h5 style="font-size:13.5px; font-weight:600;">${escapeHtml(top.title)}</h5>
          <p style="font-size:11.5px; color:#94a3b8;">${escapeHtml(top.area)} · ${escapeHtml(top.date)}</p>
        </div>
        <span class="badge ${getBadgeClass(top.status)}">${escapeHtml(top.status)}</span>
      </div>`;
  }

  // Water Availability by Service Area Widget
  const sourcesContainer = document.getElementById('dash-sources-container');
  if (store.sources.length === 0) {
    sourcesContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">No water sources monitored.</p>`;
  } else {
    sourcesContainer.innerHTML = store.sources.map(src => `
      <div class="list-item" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 0; border-top: 1px solid #f1f5f9;">
        <div class="list-item-info">
          <h5 style="font-size:14px; font-weight:600;">${escapeHtml(src.title)}</h5>
          <p style="font-size:11.5px; color:#94a3b8;">Serving ${escapeHtml(src.area)}</p>
        </div>
        <span class="badge ${getBadgeClass(src.status)}">${escapeHtml(src.status)}</span>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   SECTION 04: DATA TABLE FILTERING & DYNAMIC RENDERING
   ========================================================================== */
function renderTable(module) {
  if (module === 'logs') return renderLogs();
  const tbody = document.getElementById(`tbody-${module}`);
  if (!tbody) return;

  const searchVal = (document.getElementById(`search-${module}`)?.value || '').toLowerCase();
  const filterVal = document.getElementById(`filter-${module}`)?.value || 'ALL';

  const items = (store[module] || []).filter(item => {
    const matchesSearch = JSON.stringify(item).toLowerCase().includes(searchVal);
    const matchesFilter = filterVal === 'ALL' || item.status === filterVal;
    return matchesSearch && matchesFilter;
  });

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No matching records. Add a record or change your filters.</td></tr>`;
    return;
  }

  let html = '';
  items.forEach(item => {
    if (module === 'zones') {
      html += `
        <tr>
          <td><span class="table-row-title">${escapeHtml(item.barangay)}</span><span class="table-row-sub">${escapeHtml(item.community)}</span></td>
          <td>${escapeHtml(item.zone)}</td>
          <td>${escapeHtml(item.description || '-')}</td>
          <td>
            <button class="btn-action-update" onclick="openEditModal('zones', ${escapeHtml(item.id)})">Update</button>
            <button class="btn-action-delete" onclick="deleteRecord('zones', ${escapeHtml(item.id)})">Delete</button>
          </td>
        </tr>`;
    } else if (module === 'residents') {
      const accountSubtitle = item.username
        ? `@${escapeHtml(item.username)} · ${escapeHtml(item.role || 'RESIDENT')}`
        : 'Admin-added profile';
      const areaText = item.area ? escapeHtml(item.area) : '<span style="color:var(--text-muted);">Unassigned area</span>';
      const addressText = item.address ? escapeHtml(item.address) : 'Profile incomplete';
      const contactText = item.contact ? escapeHtml(item.contact) : '<span style="color:var(--text-muted);">Not provided</span>';

      html += `
        <tr>
          <td>
            <span class="table-row-title">${escapeHtml(item.name)}</span>
            <span class="table-row-sub">${accountSubtitle}</span>
          </td>
          <td>
            <span class="table-row-title">${areaText}</span>
            <span class="table-row-sub">${addressText}</span>
          </td>
          <td><span class="badge ${getBadgeClass(item.status)}">${escapeHtml(item.status)}</span></td>
          <td>${contactText}</td>
          <td>
            <button class="btn-action-update" onclick="openEditModal('residents', ${escapeHtml(item.id)})">Update</button>
            <button class="btn-action-delete" onclick="deleteRecord('residents', ${escapeHtml(item.id)})">Delete</button>
          </td>
        </tr>`;
    } else if (module === 'personnel') {
      html += `
        <tr>
          <td><span class="table-row-title">${escapeHtml(item.name)}</span></td>
          <td>${escapeHtml(item.area)}</td>
          <td><span class="badge ${getBadgeClass(item.status)}">${escapeHtml(item.status)}</span></td>
          <td>${escapeHtml(item.contact)}</td>
          <td>
            <button class="btn-action-update" onclick="openEditModal('personnel', ${escapeHtml(item.id)})">Update</button>
            <button class="btn-action-delete" onclick="deleteRecord('personnel', ${escapeHtml(item.id)})">Delete</button>
          </td>
        </tr>`;
    } else {
      html += `
        <tr>
          <td><span class="table-row-title">${escapeHtml(item.title)}</span><span class="table-row-sub">${escapeHtml(item.code || '#' + item.id)}</span></td>
          <td>${escapeHtml(item.area)}</td>
          <td><span class="badge ${getBadgeClass(item.status)}">${escapeHtml(item.status)}</span></td>
          <td>${escapeHtml(item.distributionDate || item.date || '—')}</td>
          <td>${escapeHtml(item.details || '-')}</td>
          <td>
            <button class="btn-action-update" onclick="openEditModal('${module}', ${escapeHtml(item.id)})">Update</button>
            <button class="btn-action-delete" onclick="deleteRecord('${module}', ${escapeHtml(item.id)})">Delete</button>
          </td>
        </tr>`;
    }
  });

  tbody.innerHTML = html;
}

/* ==========================================================================
   SECTION 05: MODAL DIALOG & CRUD FORM OPERATIONS
   ========================================================================== */
function openModal(module) {
  currentModule = module;
  currentEditId = null;
  currentRevision = null;

  const titleMap = {
    zones: 'Add Barangay & Zone Management',
    sources: 'Add Water Source Monitoring',
    schedules: 'Add Distribution Schedule',
    allocation: 'Add Water Allocation Record',
    personnel: 'Add Distribution Personnel',
    announcements: 'Add Announcement & Advisory',
    reports: 'Add Water Report & Complaint',
    requests: 'Add Water Request',
    residents: 'Add Registered Resident'
  };
  document.getElementById('modal-title').innerText = titleMap[module] || 'Add New Record';

  renderModalFields(module, {});
  showModal();
}

function openEditModal(module, id) {
  const record = store[module].find(item => item.id === id);
  if (!record) return;

  currentModule = module;
  currentEditId = id;
  currentRevision = record.revision;

  document.getElementById('modal-title').innerText = `Update ${module.slice(0, -1)}`;
  renderModalFields(module, record);
  showModal();
}

function showModal() {
  modalTrigger = document.activeElement;
  const modal = document.getElementById('app-modal');
  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  (modal.querySelector('input, textarea, select') || modal.querySelector('.modal-close')).focus();
}

function closeModal() {
  const modal = document.getElementById('app-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  if (modalTrigger?.isConnected) modalTrigger.focus();
}

function renderModalFields(module, data) {
  const container = document.getElementById('modal-fields');
  let fieldsHtml = '';

  if (module === 'zones') {
    fieldsHtml = `
      <div class="form-grid">
        <div class="form-group">
          <label>Community</label>
          <input type="text" id="field-community" class="form-control" value="${escapeHtml(data.community || store.settings?.community || 'AgosPantay')}">
        </div>
        <div class="form-group">
          <label>Barangay</label>
          <input type="text" id="field-barangay" class="form-control" value="${escapeHtml(data.barangay || store.settings?.barangay || '')}">
        </div>
      </div>
      <div class="form-group">
        <label>Purok / Zone</label>
        <input type="text" id="field-zone" class="form-control" value="${escapeHtml(data.zone || 'Purok 1')}">
      </div>
      <div class="form-group full">
        <label>Description</label>
        <textarea id="field-description" class="form-control">${escapeHtml(data.description || '')}</textarea>
      </div>`;
  } else if (module === 'residents') {
    fieldsHtml = `
      ${data.username ? `
        <div class="form-group">
          <label>Account Username &amp; Role</label>
          <input type="text" class="form-control" value="@${escapeHtml(data.username)} (${escapeHtml(data.role || 'RESIDENT')})" readonly>
        </div>` : ''}
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="field-name" class="form-control" value="${escapeHtml(data.name || '')}" required>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Purok / Area</label>
          <input type="text" id="field-area" class="form-control" value="${escapeHtml(data.area || 'Purok 1')}">
        </div>
        <div class="form-group">
          <label>Barangay Address</label>
          <input type="text" id="field-address" class="form-control" value="${escapeHtml(data.address || store.settings?.barangay || '')}">
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Contact Number</label>
          <input type="text" id="field-contact" class="form-control" value="${escapeHtml(data.contact || '')}">
        </div>
        <div class="form-group">
          <label>Account Status</label>
          <select id="field-status" class="form-control">
            <option value="Active" ${data.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Pending" ${data.status === 'Pending' ? 'selected' : ''}>Pending</option>
          </select>
        </div>
      </div>`;
  } else if (module === 'personnel') {
    fieldsHtml = `
      <div class="form-group">
        <label>Personnel Full Name</label>
        <input type="text" id="field-name" class="form-control" value="${escapeHtml(data.name || '')}" required>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Assigned Service Area</label>
          <input type="text" id="field-area" class="form-control" value="${escapeHtml(data.area || 'Purok 1')}">
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="field-status" class="form-control">
            <option value="Active" ${data.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="On-Leave" ${data.status === 'On-Leave' ? 'selected' : ''}>On-Leave</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Contact Phone</label>
        <input type="text" id="field-contact" class="form-control" value="${escapeHtml(data.contact || '')}">
      </div>`;
  } else {
    fieldsHtml = `
      <div class="form-group">
        <label>Title / Record Name</label>
        <input type="text" id="field-title" class="form-control" value="${escapeHtml(data.title || '')}" required>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Service Area</label>
          <input type="text" id="field-area" class="form-control" value="${escapeHtml(data.area || 'Purok 1')}">
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="field-status" class="form-control">
            ${getStatusOptions(module, data.status)}
          </select>
        </div>
      </div>
      ${module === 'schedules' ? `
        <div class="form-group">
          <label for="field-distribution-date">Distribution date</label>
          <input type="date" id="field-distribution-date" class="form-control" value="${escapeHtml(data.distributionDate || '')}" required>
        </div>` : ''}
      ${module === 'reports' || module === 'requests' ? `
        <div class="form-group">
          <label for="field-response">Official response</label>
          <textarea id="field-response" maxlength="2000" class="form-control">${escapeHtml(data.response || '')}</textarea>
        </div>` : ''}
      <div class="form-group full">
        <label>Details / Notes</label>
        <textarea id="field-details" class="form-control">${escapeHtml(data.details || '')}</textarea>
      </div>`;
  }

  container.innerHTML = fieldsHtml;
}

function getStatusOptions(module, selected) {
  const statusMap = {
    sources: ['Normal', 'Low Supply', 'Interrupted'],
    schedules: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    allocation: ['Recorded', 'Pending'],
    announcements: ['Published', 'Draft'],
    reports: ['Submitted', 'Under Review', 'Action Taken', 'Resolved', 'Rejected'],
    requests: ['Submitted', 'Under Review', 'Approved', 'Fulfilled', 'Rejected']
  };

  return (statusMap[module] || [])
    .map(opt => `<option value="${opt}" ${selected === opt ? 'selected' : ''}>${opt}</option>`)
    .join('');
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const module = currentModule;
  const id = currentEditId;
  const button = event.currentTarget.querySelector('button[type="submit"]');
  if (button.disabled) return;

  const field = name => document.getElementById(`field-${name}`).value;
  let body;

  if (module === 'zones') {
    body = { community: field('community'), barangay: field('barangay'), zone: field('zone'), description: field('description') };
  } else if (module === 'residents') {
    body = { name: field('name'), area: field('area'), address: field('address'), contact: field('contact'), status: field('status') };
  } else if (module === 'personnel') {
    body = { name: field('name'), area: field('area'), contact: field('contact'), status: field('status') };
  } else {
    body = { title: field('title'), area: field('area'), status: field('status'), details: field('details') };
    if (module === 'schedules') body.distributionDate = field('distribution-date');
    if (module === 'reports' || module === 'requests') body.response = field('response');
  }

  if (id !== null && module !== 'residents') body.revision = currentRevision;

  button.disabled = true;
  try {
    const url = `/api/admin/records/${module}${id === null ? '' : `/${id}`}`;
    await AgosAuth.request(url, { method: id === null ? 'POST' : 'PUT', body });
    closeModal();
    AgosAuth.notice('Record saved.');
    await refreshAdminData();
  } catch (error) {
    AgosAuth.notice(error.message);
  } finally {
    button.disabled = false;
  }
}

async function deleteRecord(module, id) {
  if (!window.confirm('Delete this record?')) return;
  try {
    await AgosAuth.request(`/api/admin/records/${module}/${id}`, { method: 'DELETE' });
    AgosAuth.notice('Record deleted.');
    await refreshAdminData();
  } catch (error) {
    AgosAuth.notice(error.message);
  }
}

/* ==========================================================================
   SECTION 06: ANALYTICS, HISTORY, LOGS, SETTINGS & CSV EXPORT
   ========================================================================== */
function updateAnalyticsData() {
  document.getElementById('analytics-total-reports').innerText = store.reports.length;
  document.getElementById('analytics-total-schedules').innerText = store.schedules.length;
  document.getElementById('analytics-total-sources').innerText = store.sources.length;
  document.getElementById('analytics-resolved-reports').innerText = store.reports.filter(r => r.status === 'Resolved').length;

  // Category Breakdown
  const catList = document.getElementById('analytics-categories-list');
  const weakFlowCount = store.reports.filter(r => r.category === 'Weak Water Flow' || (!r.category && /weak|flow/i.test(r.title))).length;
  catList.innerHTML = `
    <div style="display:flex; justify-content:space-between; font-size:13px;">
      <span>Weak Water Flow</span>
      <span style="font-weight:700;">${weakFlowCount}</span>
    </div>`;

  // Status Breakdown
  const statusList = document.getElementById('analytics-status-list');
  const statuses = ['Submitted', 'Under Review', 'Action Taken', 'Resolved', 'Rejected'];
  statusList.innerHTML = statuses.map(st => `
    <div style="display:flex; justify-content:space-between; font-size:13px; border-bottom: 1px solid #f8fafc; padding-bottom: 6px;">
      <span>${st}</span>
      <span style="font-weight:700;">${store.reports.filter(r => r.status === st).length}</span>
    </div>`).join('');
}

function renderHistory() {
  const tbody = document.getElementById('tbody-history');
  if (!tbody) return;

  const historyItems = [
    ...store.schedules.map(x => ({ title: x.title, module: 'Schedules', area: x.area, status: x.status, date: x.distributionDate || x.date })),
    ...store.allocation.map(x => ({ title: x.title, module: 'Allocations', area: x.area, status: x.status, date: x.date })),
    ...store.reports.map(x => ({ title: x.title, module: 'Reports', area: x.area, status: x.status, date: x.date })),
    ...store.requests.map(x => ({ title: x.title, module: 'Water Requests', area: x.area, status: x.status, date: x.date })),
    ...store.sources.map(x => ({ title: x.title, module: 'Water Sources', area: x.area, status: x.status, date: x.date }))
  ];

  tbody.innerHTML = historyItems.map(item => `
    <tr>
      <td><span class="table-row-title">${escapeHtml(item.title)}</span></td>
      <td>${escapeHtml(item.module)}</td>
      <td>${escapeHtml(item.area)}</td>
      <td><span class="badge ${getBadgeClass(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.date || '—')}</td>
    </tr>`).join('');
}

function renderLogs() {
  const tbody = document.getElementById('tbody-logs');
  if (!tbody) return;

  if (!store.logs || store.logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 24px;">No activity logs recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = store.logs.map(log => `
    <tr>
      <td><span class="table-row-sub">${escapeHtml(log.time)}</span></td>
      <td><span class="table-row-title">${escapeHtml(log.user)}</span></td>
      <td>${escapeHtml(log.action)}</td>
    </tr>`).join('');
}

async function savePortalSettings(event) {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button[type="submit"]');
  if (button.disabled) return;

  button.disabled = true;
  try {
    await AgosAuth.request('/api/admin/settings', {
      method: 'PUT',
      body: {
        community: document.getElementById('settings-community').value,
        barangay: document.getElementById('settings-barangay').value
      }
    });
    AgosAuth.notice('Settings saved.');
    await refreshAdminData();
  } catch (error) {
    AgosAuth.notice(error.message);
  } finally {
    button.disabled = false;
  }
}

function exportCSV() {
  const headers = ['ID', 'Title', 'Area', 'Status', 'Date', 'Details'];
  const csvCell = value => {
    let text = String(value ?? '');
    if (/^\s*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = store.reports.map(report =>
    [report.id, report.title, report.area, report.status, report.date, report.details].map(csvCell).join(',')
  );

  const blob = new Blob([[headers.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'agos_pantay_reports.csv';
  link.click();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/* ==========================================================================
   SECTION 07: API SYNCHRONIZATION & PAGE INITIALIZATION
   ========================================================================== */
async function refreshAdminData() {
  const version = ++refreshVersion;
  try {
    const next = await AgosAuth.request('/api/admin/dashboard');
    if (version !== refreshVersion) return;

    store = next;
    AgosAuth.applySettings(store.settings);

    if (activeTab === 'settings') {
      document.getElementById('settings-community').value = store.settings.community;
      document.getElementById('settings-barangay').value = store.settings.barangay;
    }

    syncCurrentDate();
    updateDashboardData();
    updateAnalyticsData();
    renderHistory();
    renderLogs();
    renderTable(activeTab);
    window.lucide?.createIcons();
  } catch (error) {
    if (version === refreshVersion) AgosAuth.notice(error.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  refreshAdminData();
  try {
    const session = await AgosAuth.request('/api/session');
    document.querySelectorAll('.user-details h4').forEach(label => { label.textContent = session.name; });
    document.querySelectorAll('.avatar-sm').forEach(avatar => { avatar.textContent = session.name.charAt(0); });
  } catch (error) {
    AgosAuth.notice(error.message);
  }
});

window.addEventListener('pageshow', event => {
  if (event.persisted) refreshAdminData();
});