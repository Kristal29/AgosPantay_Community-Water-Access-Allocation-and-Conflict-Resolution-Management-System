'use strict';

/* ==========================================================================
   SECTION 01: APPLICATION STATE & SECURITY UTILITIES
   ========================================================================== */
const PAGE_TITLES = Object.freeze({
  dashboard: 'Dashboard',
  schedules: 'My Water Schedule',
  calendar: 'Schedule Calendar',
  announcements: 'Announcements & Advisories',
  'submit-report': 'Submit a Report',
  reports: 'My Reports',
  requests: 'Water Assistance',
  notifications: 'Notifications',
  profile: 'My Profile',
  conservation: 'Water Conservation',
  contacts: 'Emergency Contacts'
});

const TABLE_MODULES = ['schedules', 'announcements', 'reports', 'requests'];

let store = {
  profile: { name: 'Resident', area: '', address: '', contact: '' },
  schedules: [],
  announcements: [],
  sources: [],
  reports: [],
  requests: [],
  personnel: [],
  readNotifications: []
};

let activeTab = 'dashboard';
let currentModule = '';
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let modalTrigger = null;
let refreshVersion = 0;

function byId(id) {
  return document.getElementById(id);
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function refreshIcons() {
  window.lucide?.createIcons();
}

function currentResident() {
  return store.profile;
}

function myRecords(module) {
  return store[module] || [];
}

function getBadgeClass(status) {
  if (['Normal', 'Published', 'Recorded', 'Resolved', 'Active', 'Completed', 'Approved', 'Fulfilled'].includes(status)) {
    return 'badge-success';
  }
  if (['Ongoing', 'Action Taken'].includes(status)) {
    return 'badge-info';
  }
  if (['Interrupted', 'Cancelled', 'Rejected', 'Unavailable'].includes(status)) {
    return 'badge-danger';
  }
  return 'badge-warning';
}

function badge(status) {
  return `<span class="badge ${getBadgeClass(status)}">${esc(status || 'Not specified')}</span>`;
}

function empty(message) {
  return `<p style="font-size:13px;color:var(--text-muted);padding:16px 0;">${esc(message)}</p>`;
}

function formattedDate(item) {
  return item.distributionDate || item.date || 'Not specified';
}

function listItem(item, subtitle, action = '') {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 0;border-top:1px solid #f1f5f9;">
      <div style="min-width:0;">
        <h5 style="font-size:13.5px;font-weight:600;overflow-wrap:anywhere;">${esc(item.title)}</h5>
        <p style="font-size:11.5px;color:#94a3b8;margin-top:4px;">${esc(subtitle)}</p>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">${badge(item.status)}${action}</div>
    </div>`;
}

/* ==========================================================================
   SECTION 02: SIDEBAR NAVIGATION & TAB SWITCHING
   ========================================================================== */
function switchTab(tabId, refresh = true) {
  if (!Object.hasOwn(PAGE_TITLES, tabId)) return;
  activeTab = tabId;

  document.querySelectorAll('.nav-link').forEach(el => {
    const active = el.dataset.tab === tabId;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });

  document.querySelectorAll('.view-pane').forEach(el => {
    el.classList.toggle('active', el.id === `view-${tabId}`);
  });

  byId('page-title').textContent = PAGE_TITLES[tabId];
  renderActiveView();
  refreshIcons();

  const syncTabs = ['dashboard', 'schedules', 'calendar', 'announcements', 'reports', 'requests', 'notifications', 'contacts'];
  if (refresh && syncTabs.includes(tabId)) {
    refreshData();
  }
}

function renderActiveView() {
  if (TABLE_MODULES.includes(activeTab)) renderTable(activeTab);
  else if (activeTab === 'dashboard') updateDashboardData();
  else if (activeTab === 'calendar') renderCalendar();
  else if (activeTab === 'notifications') renderNotifications();
  else if (activeTab === 'profile') renderProfile();
  else if (activeTab === 'contacts') renderContacts();
}
/* END SECTION 02: SIDEBAR NAVIGATION & TAB SWITCHING */

/* ==========================================================================
   SECTION 03 & 04: RESIDENT IDENTITY & DASHBOARD OVERVIEW RENDERING
   ========================================================================== */
function syncIdentity() {
  const person = currentResident();
  document.querySelectorAll('[data-resident-name]').forEach(el => {
    el.textContent = person.name;
  });
  document.querySelectorAll('[data-resident-avatar]').forEach(el => {
    el.textContent = person.name.trim().charAt(0).toUpperCase() || 'R';
  });

  byId('resident-greeting').textContent = `Hello, ${person.name.trim().split(/\s+/)[0] || 'Resident'}`;
  byId('resident-area-summary').textContent = person.area && person.address
    ? `Here is the latest water information for ${person.area}, ${person.address}.`
    : 'Complete My Profile to see water schedules for your area.';
  byId('report-area').value = person.area;
  byId('today-label').textContent = new Date().toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function updateDashboardData() {
  const schedules = myRecords('schedules');
  byId('dash-stat-schedules').textContent = schedules.length;
  byId('dash-stat-reports').textContent = myRecords('reports').length;
  byId('dash-stat-requests').textContent = myRecords('requests').length;
  byId('dash-stat-announcements').textContent = myRecords('announcements').length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = schedules
    .filter(item => {
      const date = scheduleDate(item);
      return !['Completed', 'Cancelled'].includes(item.status) && (!date || date >= today);
    })
    .sort((a, b) => (scheduleDate(a)?.getTime() ?? Infinity) - (scheduleDate(b)?.getTime() ?? Infinity));

  byId('dash-schedules-container').innerHTML = upcoming.length
    ? upcoming.slice(0, 3).map(item => listItem(item, `${item.area} · ${formattedDate(item)}`)).join('')
    : empty('No upcoming schedules for your area.');

  byId('dash-latest-announcements-container').innerHTML = myRecords('announcements')
    .slice(0, 3)
    .map(item => listItem(item, `${item.area} · ${formattedDate(item)}`))
    .join('') || empty('No announcements published for your area.');

  byId('dash-sources-container').innerHTML = myRecords('sources')
    .map(item => listItem(item, `Serving ${item.area} · ${item.details || ''}`))
    .join('') || empty('No water sources have been recorded for your area.');
}

/* ==========================================================================
   SECTION 05: DATA TABLES, REPORT SUBMISSION & ASSISTANCE REQUESTS
   ========================================================================== */
function renderTable(module) {
  if (!TABLE_MODULES.includes(module)) return;

  const search = (byId(`search-${module}`).value || '').trim().toLowerCase();
  const status = byId(`filter-${module}`).value;
  const rows = myRecords(module).filter(item =>
    JSON.stringify(item).toLowerCase().includes(search) && (status === 'ALL' || item.status === status)
  );

  byId(`tbody-${module}`).innerHTML = rows.length
    ? rows.map(item => `
        <tr>
          <td><span class="table-row-title">${esc(item.title)}</span><span class="table-row-sub">${esc(item.code || '#' + item.id)}</span></td>
          <td>${esc(item.area)}</td>
          <td>${badge(item.status)}</td>
          <td>${esc(formattedDate(item))}</td>
          <td style="max-width:300px;overflow-wrap:anywhere;">${esc(item.details || '—')}</td>
          <td><button type="button" class="btn-action-update" data-record-module="${module}" data-record-id="${esc(item.id)}">View details</button></td>
        </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">No matching records. Try another search or status filter.</td></tr>';
}

async function submitReport(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;

  button.disabled = true;
  try {
    const body = Object.fromEntries(new FormData(form));
    const submitted = await AgosAuth.request('/api/reports', { method: 'POST', body });
    form.reset();
    syncIdentity();
    switchTab('reports');
    AgosAuth.notice('Report submitted. Tracking number ' + submitted.code + '.');
  } catch (error) {
    AgosAuth.notice(error.message);
  } finally {
    button.disabled = false;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const button = byId('modal-submit');
  if (currentModule !== 'requests' || button.disabled) return;

  const body = Object.fromEntries(new FormData(event.currentTarget));
  body.quantity = Number(body.quantity);
  body.householdSize = Number(body.householdSize);

  button.disabled = true;
  try {
    const submitted = await AgosAuth.request('/api/requests', { method: 'POST', body });
    closeModal();
    switchTab('requests');
    AgosAuth.notice('Water request submitted. Tracking number ' + submitted.code + '.');
  } catch (error) {
    AgosAuth.notice(error.message);
  } finally {
    button.disabled = false;
  }
}

/* ==========================================================================
   SECTION 06: SCHEDULE CALENDAR & NOTIFICATIONS
   ========================================================================== */
function scheduleDate(item) {
  const raw = item.distributionDate || item.scheduledDate || item.date;
  if (typeof raw !== 'string') return null;

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (iso) {
    const value = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return value.getFullYear() === Number(iso[1]) &&
           value.getMonth() === Number(iso[2]) - 1 &&
           value.getDate() === Number(iso[3]) ? value : null;
  }

  if (!/\b\d{4}\b/.test(raw)) return null;
  const value = new Date(raw);
  return Number.isNaN(value.getTime()) ? null : value;
}

function changeMonth(delta) {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + delta, 1);
  renderCalendar();
}

function resetCalendar() {
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  renderCalendar();
}

function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const schedules = myRecords('schedules');
  const now = new Date();

  byId('calendar-month').textContent = calendarMonth.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
  let html = '';

  for (let cell = 0; cell < Math.ceil((offset + days) / 7) * 7; cell++) {
    if (cell % 7 === 0) html += '<tr>';
    const day = cell - offset + 1;

    if (day < 1 || day > days) {
      html += '<td style="height:100px;background:#fafafa;"></td>';
    } else {
      const today = now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
      const events = schedules.filter(item => {
        const date = scheduleDate(item);
        return date && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
      });

      html += `
        <td style="height:100px;vertical-align:top;padding:10px;${today ? 'background:var(--accent-teal-light);' : ''}">
          <strong${today ? ' aria-label="Today"' : ''}>${day}</strong>
          ${events.map(item => `
            <button type="button" class="btn-secondary" style="display:block;width:100%;padding:6px;margin-top:8px;text-align:left;font-size:10px;white-space:normal;overflow-wrap:anywhere;" data-record-module="schedules" data-record-id="${esc(item.id)}">
              ${esc(item.title)}<br>${esc(item.status)}
            </button>`).join('')}
        </td>`;
    }

    if (cell % 7 === 6) html += '</tr>';
  }

  byId('calendar-body').innerHTML = html;
  const undated = schedules.filter(item => !scheduleDate(item)).length;
  byId('calendar-note').textContent = undated
    ? `${undated} schedule(s) have no complete date. View them in My Water Schedule.`
    : 'Select a scheduled distribution to see its details.';
}

function notificationItems() {
  return ['announcements', 'reports', 'requests'].flatMap(module =>
    myRecords(module).map(item => ({
      key: `${item.id}:${item.revision}`,
      module,
      id: item.id,
      revision: item.revision,
      title: item.title,
      status: item.status,
      date: formattedDate(item),
      summary: module === 'announcements'
        ? item.details
        : `${module === 'reports' ? 'Report' : 'Water request'} status: ${item.status}${item.response ? '. ' + item.response : ''}`
    }))
  );
}

function updateNotificationDot() {
  byId('notification-dot').hidden = !notificationItems().some(item => !store.readNotifications.includes(item.key));
}

function renderNotifications() {
  const items = notificationItems();
  byId('notifications-container').innerHTML = items.map(item => `
    <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;padding:16px 0;border-top:1px solid #f1f5f9;">
      <div style="min-width:0;">
        <span class="table-row-title">${esc(item.title)} ${store.readNotifications.includes(item.key) ? '' : '<span class="badge badge-info">New</span>'}</span>
        <p style="font-size:13px;color:var(--text-muted);margin:6px 0;overflow-wrap:anywhere;">${esc(item.summary)}</p>
        <span class="table-row-sub">${esc(item.date)}</span>
      </div>
      <button type="button" class="btn-secondary" data-record-module="${item.module}" data-record-id="${esc(item.id)}">View</button>
    </div>`).join('') || empty('You have no notifications yet.');
}

async function markNotificationsRead() {
  const body = notificationItems().map(({ id, revision }) => ({ id, revision }));
  try {
    await AgosAuth.request('/api/resident/notifications/read', { method: 'POST', body });
    AgosAuth.notice('Notifications marked as read.');
    await refreshData();
  } catch (error) {
    AgosAuth.notice(error.message);
  }
}

/* ==========================================================================
   SECTION 07: MY PROFILE & EMERGENCY CONTACTS
   ========================================================================== */
function renderProfile() {
  const person = currentResident();
  byId('profile-name').value = person.name;
  byId('profile-contact').value = person.contact;
  byId('profile-barangay').value = person.address;
  byId('profile-area').value = person.area;
}

async function saveProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;

  button.disabled = true;
  try {
    await AgosAuth.request('/api/resident/profile', {
      method: 'PUT',
      body: Object.fromEntries(new FormData(form))
    });
    AgosAuth.notice('Profile saved.');
    await refreshData();
  } catch (error) {
    AgosAuth.notice(error.message);
  } finally {
    button.disabled = false;
  }
}

function renderContacts() {
  byId('contacts-container').innerHTML = myRecords('personnel').map(item => `
    <div style="padding:16px 0;border-top:1px solid #f1f5f9;">
      <span class="table-row-title">${esc(item.name)}</span>
      <p style="font-size:12px;color:var(--text-muted);margin:6px 0;">Assigned area: ${esc(item.area)}${item.isDemo ? ' · Sample contact' : ''}</p>
      <span style="font-size:14px;">${esc(item.contact || 'Contact number not provided')}</span>
    </div>`).join('') || empty('No active distribution contacts have been posted for your area. Please contact your barangay office.');
}

/* ==========================================================================
   SECTION 08: MODAL DIALOG, API SYNCHRONIZATION & INITIALIZATION
   ========================================================================== */
function openDialog(title, fields, submitting = false) {
  modalTrigger = document.activeElement;
  byId('modal-title').textContent = title;
  byId('modal-fields').innerHTML = fields;
  byId('modal-submit').hidden = !submitting;
  byId('modal-submit').style.display = submitting ? 'inline-flex' : 'none';
  byId('modal-cancel').textContent = submitting ? 'Cancel' : 'Close';

  const modal = byId('app-modal');
  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  document.querySelector('aside').inert = true;
  document.querySelector('.main-wrapper').inert = true;
  refreshIcons();
  (modal.querySelector('input:not([readonly]), textarea') || modal.querySelector('.modal-close')).focus();
}

function closeModal() {
  const modal = byId('app-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  currentModule = '';
  document.querySelector('aside').inert = false;
  document.querySelector('.main-wrapper').inert = false;
  if (modalTrigger?.isConnected) modalTrigger.focus();
}

function openDetails(module, id) {
  if (!TABLE_MODULES.includes(module)) return;
  const item = myRecords(module).find(record => String(record.id) === String(id));
  if (!item) return;

  currentModule = '';
  const fields = [
    ['Reference', item.code || '#' + item.id],
    ['Title', item.title],
    ['Service area', item.area],
    ['Status', item.status],
    ['Date', formattedDate(item)]
  ];

  const extraFields = [
    ['distributionDate', 'Distribution date'],
    ['startTime', 'Opening time'],
    ['endTime', 'Closing time'],
    ['category', 'Category'],
    ['priority', 'Urgency'],
    ['location', 'Location'],
    ['quantity', 'Requested liters'],
    ['householdSize', 'Household members'],
    ['details', 'Details'],
    ['response', 'Official response'],
    ['investigation', 'Investigation findings']
  ];

  for (const [key, label] of extraFields) {
    if (item[key] !== undefined && item[key] !== '') {
      fields.push([label, item[key]]);
    }
  }

  openDialog(
    'Record details',
    fields.map(([label, value]) => `
      <div class="form-group">
        <label>${esc(label)}</label>
        <p style="font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;">${esc(value)}</p>
      </div>`).join('')
  );
}

function openModal(module) {
  if (module !== 'requests') return;
  currentModule = 'requests';
  openDialog(
    'Request Water Assistance',
    `
      <div class="form-group">
        <label for="field-title">Request summary</label>
        <input id="field-title" name="title" class="form-control" required maxlength="120" placeholder="Additional water for household">
      </div>
      <div class="form-group">
        <label for="field-area">Registered service area</label>
        <input id="field-area" class="form-control" value="${esc(currentResident().area)}" readonly>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="field-quantity">Requested quantity (liters)</label>
          <input id="field-quantity" name="quantity" type="number" min="1" max="100000" step="1" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="field-household">Household members</label>
          <input id="field-household" name="householdSize" type="number" min="1" max="100" step="1" class="form-control" required>
        </div>
      </div>
      <div class="form-group">
        <label for="field-reason">Reason for request</label>
        <textarea id="field-reason" name="reason" class="form-control" required maxlength="2000"></textarea>
      </div>
      <p style="font-size:12px;color:var(--text-muted);">Your request will be submitted for administrator review.</p>`,
    true
  );
}

async function refreshData() {
  const version = ++refreshVersion;
  try {
    const next = await AgosAuth.request('/api/resident/dashboard');
    if (version !== refreshVersion) return false;
    store = next;
    AgosAuth.applySettings(store.settings);
    syncIdentity();
    updateDashboardData();
    updateNotificationDot();
    renderActiveView();
    refreshIcons();
    return true;
  } catch (error) {
    if (version === refreshVersion) AgosAuth.notice(error.message);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (await refreshData() && activeTab === 'dashboard') {
    const person = currentResident();
    if (!person.address || !person.area) switchTab('profile', false);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  byId('modal-submit').style.display = 'none';

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-record-module]');
    if (button) openDetails(button.dataset.recordModule, button.dataset.recordId);
  });

  byId('app-modal').addEventListener('click', event => {
    if (event.target === byId('app-modal')) closeModal();
  });

  document.addEventListener('keydown', event => {
    const dialog = byId('app-modal');
    if (event.key === 'Escape' && dialog.classList.contains('active')) closeModal();

    if (event.key === 'Tab' && dialog.classList.contains('active')) {
      const elements = [...dialog.querySelectorAll('button, input, textarea, select, a[href]')]
        .filter(el => !el.hidden && !el.disabled && el.getClientRects().length);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});

window.addEventListener('pageshow', event => {
  if (event.persisted) refreshData();
});