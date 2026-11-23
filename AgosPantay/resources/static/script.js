(function () {
  'use strict';

  /* ==========================================================================
     SECTION 01: SHARED CSRF & API FETCH HELPER
     ========================================================================== */
  async function request(path, { method = 'GET', body, signingIn = false } = {}) {
    const headers = { Accept: 'application/json' };
    let payload = body;

    if (body !== undefined && !(body instanceof URLSearchParams)) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    let response;
    try {
      if (method !== 'GET') {
        const csrfResponse = await fetch('/api/csrf', { credentials: 'same-origin', cache: 'no-store' });
        if (!csrfResponse.ok) throw new Error('Unable to start the request.');
        const csrf = await csrfResponse.json();
        headers[csrf.header] = csrf.token;
      }
      response = await fetch(path, {
        method,
        headers,
        body: payload,
        credentials: 'same-origin',
        cache: 'no-store'
      });
    } catch {
      throw new Error('Cannot contact the AgosPantay server. Check your connection and try again.');
    }

    if (response.status === 401 && !signingIn) {
      window.location.replace('/');
    }
    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || 'The server could not complete this action. Try again.');
    }
    return data;
  }

  /* ==========================================================================
     SECTION 02: PORTAL TOAST NOTIFICATIONS & SETTINGS SYNC
     ========================================================================== */
  let noticeTimer;

  function notice(text) {
    const box = document.getElementById('portal-message');
    if (!box) return;
    box.textContent = text;
    box.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { box.hidden = true; }, 6500);
  }

  function applySettings(settings) {
    if (!settings) return;
    document.querySelectorAll('[data-community-name]').forEach(label => {
      label.textContent = settings.community;
    });
  }

  /* ==========================================================================
     SECTION 03: SIGN IN & SIGN OUT HANDLERS
     ========================================================================== */
  function formMessage(form, text, success = false) {
    const box = form.querySelector('[data-auth-message]');
    if (!box) return;
    box.classList.toggle('success', success);
    box.textContent = text;
    box.hidden = !text;
  }

  function showForm(formId) {
    if (!['SignIn-form', 'Register-form'].includes(formId)) return;
    document.querySelectorAll('.form-box').forEach(box => box.classList.toggle('active', box.id === formId));
    document.querySelectorAll('[data-auth-message]').forEach(box => { box.hidden = true; });
    document.getElementById(formId)?.querySelector('input')?.focus();
  }

  async function signIn(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    formMessage(form, '');

    try {
      const body = new URLSearchParams({
        username: form.elements.username.value.trim(),
        password: form.elements.password.value
      });
      const login = await request('/api/login', { method: 'POST', body, signingIn: true });
      form.elements.password.value = '';
      window.location.assign(login.page);
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      button.disabled = false;
    }
  }

  let signingOut = false;
  async function signOut() {
    if (signingOut) return;
    signingOut = true;
    try {
      await request('/api/logout', { method: 'POST' });
      window.location.replace('/');
    } catch (error) {
      notice(error.message);
    } finally {
      signingOut = false;
    }
  }

  /* ==========================================================================
     SECTION 04: ACCOUNT REGISTRATION HANDLER
     ========================================================================== */
  async function register(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    formMessage(form, '');

    try {
      const username = form.elements.username.value.trim();
      const password = form.elements.password.value;
      const role = form.elements.role ? form.elements.role.value : 'community_member';
      if (!role) {
        throw new Error('Select an account role.');
      }

      const result = await request('/api/register', {
        method: 'POST',
        body: { username, password, role },
        signingIn: true
      });

      form.reset();
      showForm('SignIn-form');
      document.getElementById('username').value = username;
      document.getElementById('password').focus();
      formMessage(
        document.querySelector('#SignIn-form form'),
        result?.message || 'Account created! Sign in with your new username and password.',
        true
      );
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      button.disabled = false;
    }
  }

  /* ==========================================================================
     SECTION 05: MOBILE SIDEBAR MENU & INITIALIZATION
     ========================================================================== */
  function attachMobileMenu() {
    const toggle = document.getElementById('portal-menu-toggle');
    const sidebar = document.getElementById('portal-sidebar');
    const backdrop = document.getElementById('portal-menu-backdrop');
    if (!sidebar || !toggle || !backdrop) return;

    const mobile = window.matchMedia('(max-width: 740px)');
    function setOpen(open, restoreFocus = true) {
      document.body.classList.toggle('portal-menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      backdrop.hidden = !open;
      if (open) sidebar.querySelector('.nav-link.active')?.focus();
      else if (restoreFocus && mobile.matches) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    backdrop.addEventListener('click', () => setOpen(false));
    sidebar.addEventListener('click', event => {
      if (mobile.matches && event.target.closest('.nav-link')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !backdrop.hidden) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (!mobile.matches && !backdrop.hidden) setOpen(false, false);
    });
  }

  window.showForm = showForm;
  window.AgosAuth = Object.freeze({ request, signOut, notice, applySettings });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#SignIn-form form')?.addEventListener('submit', signIn);
    document.querySelector('#Register-form form')?.addEventListener('submit', register);
    attachMobileMenu();
    window.lucide?.createIcons();
  });
})();