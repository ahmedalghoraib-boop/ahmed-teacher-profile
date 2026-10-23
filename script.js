'use strict';

/* ============================================================
   Ahmed Alghoraib — teaching profile site
   Shared runtime for homepage + availability page.
   Availability data lives in availability.json (Option A):
   the page fetches it once on load and renders the grid
   from that data. Ahmed updates the JSON file and pushes
   to update what students see.
   ============================================================ */

const AVAILABILITY_URL = 'availability.json';

// Cache-busting version — update when availability.json changes to force refresh.
// Can be a timestamp, hash, or incrementing number.
const AVAILABILITY_VERSION = '20260928';

// Inline fallback data — used when fetch fails (e.g. opening via file://).
// Kept in sync with availability.json. When fetch works (localhost / GitHub Pages),
// this is never used.
const INLINE_AVAILABILITY_DATA = {
  "timezone": "Africa/Cairo",
  "description": "Weekends only — Saturday and Sunday. Slots shown in your local timezone.",
  "gridHours": 24,
  "slotMinutes": 15,
  "slotsPerDay": 96,
  "minSessionMinutes": 15,
  "prayerTimes": {
    "64": "Asr 4:13 PM",
    "65": "Asr 4:13 PM",
    "66": "Asr 4:13 PM",
    "75": "Maghrib 6:46 PM",
    "76": "Maghrib 6:46 PM",
    "77": "Maghrib 6:46 PM",
    "80": "Isha 8:04 PM",
    "81": "Isha 8:04 PM",
    "82": "Isha 8:04 PM"
  },
  "prayerBreaks": {
    "Saturday": [64, 65, 66, 75, 76, 77, 80, 81, 82],
    "Sunday": [64, 65, 66, 75, 76, 77, 80, 81, 82]
  },
  "slots": {
    "Saturday": [
      67, 68, 69, 70, 71, 72, 73, 74, 78, 79,
      83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95
    ],
    "Sunday": [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      67, 68, 69, 70, 71, 72, 73, 74, 78, 79,
      83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95
    ]
  }
};

/* ---- Helpers ---- */

function element(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const key in props) {
    if (key === 'className') {
      el.className = props[key];
    } else if (key === 'style' && typeof props[key] === 'object') {
      Object.assign(el.style, props[key]);
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else if (key === 'dataset') {
      Object.assign(el.dataset, props[key]);
    } else if (key === 'html') {
      el.innerHTML = props[key];
    } else if (key === 'text') {
      el.textContent = props[key];
    } else {
      el.setAttribute(key, props[key]);
    }
  }
  for (const child of children) {
    appendNode(el, child);
  }
  return el;
}

function appendNode(parent, child) {
  if (child == null || child === '') return;
  if (Array.isArray(child)) {
    for (const c of child) parent.appendChild(c);
  } else if (typeof child === 'string') {
    parent.appendChild(document.createTextNode(child));
  } else {
    parent.appendChild(child);
  }
}

function formatTimeSlotLabel(slotIndex) {
  const totalMinutes = slotIndex * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const m = String(minutes).padStart(2, '0');
  return `${h12}:${m} ${ampm}`;
}

function slotIndexToCairoTime(slotIndex) {
  const totalMinutes = slotIndex * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, slotIndex };
}

/* ---- Timezone detection ---- */

function getTimezoneName() {
  try {
    if ('Intl' in window && 'resolvedOptions' in Intl) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) return tz;
    }
  } catch (e) {
    // silent fallback
  }
  return 'Unknown';
}

function formatTimezoneName(tz) {
  if (!tz || tz === 'Unknown') return '—';
  try {
    const dt = new Date();
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'short'
    }).formatToParts(dt);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? `${tz} (${tzPart.value})` : tz;
  } catch (e) {
    return tz;
  }
}

/* ---- Availability data ---- */

async function loadAvailability() {
  try {
    const url = `${AVAILABILITY_URL}?v=${AVAILABILITY_VERSION}`;
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`availability.json returned ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (e) {
    console.warn('Failed to load availability.json, using inline fallback:', e);
    return INLINE_AVAILABILITY_DATA;
  }
}

function buildAvailabilityMap(data) {
  const gridHours = data.gridHours || 24;
  const slotMinutes = data.slotMinutes || 15;
  const slotsPerDay = (gridHours * 60) / slotMinutes;

  const map = {};
  const days = ['Saturday', 'Sunday'];

  for (const dayName of days) {
    const dayData = data.slots && data.slots[dayName];
    const prayerBreaks = (data.prayerBreaks && data.prayerBreaks[dayName]) || [];
    const set = new Set((dayData && dayData.available) || []);
    map[dayName] = [];

    for (let i = 0; i < slotsPerDay; i++) {
      let kind = 'outside'; // default: outside teaching window
      if (set.has(i)) {
        kind = 'available';
      }
      if (prayerBreaks.includes(i)) {
        kind = 'prayer';
      }
      map[dayName].push({ index: i, kind });
    }
  }

  return { map, slotsPerDay, slotMinutes, gridHours };
}

/* ---- Render homepage hero CTA with live availability hint ---- */

function renderHomepage() {
  const cta = document.querySelector('.nav-cta');
  if (!cta) return;
  // Add a small live hint under the availability CTA on the homepage.
  const hint = document.createElement('span');
  hint.className = 'cta-hint';
  hint.textContent = 'See my current available slots →';
  cta.parentNode.insertBefore(hint, cta.nextSibling);
}

/* ---- Render availability page ---- */

function renderAvailabilityPage() {
  const daysContainer = document.getElementById('days-container');
  const userTzEl = document.getElementById('user-tz');
  const modal = document.getElementById('booking-modal');

  if (!daysContainer) return;

  // Show the user's detected timezone.
  if (userTzEl) {
    const tz = getTimezoneName();
    userTzEl.textContent = formatTimezoneName(tz);
  }

  loadAvailability().then(data => {
    if (!data) {
      if (daysContainer) {
        daysContainer.textContent = 'Unable to load schedule data. Please refresh the page.';
      }
      return;
    }
    const { map, slotsPerDay } = buildAvailabilityMap(data);
    renderDayGrid('Saturday', map.Saturday, slotsPerDay, data);
    renderDayGrid('Sunday', map.Sunday, slotsPerDay, data);
  });

  // Modal wiring.
  if (modal && document.getElementById('modal-close')) {
    setupModal(modal);
  }
}

function renderDayGrid(dayName, slots, slotsPerDay, data) {
  const container = document.getElementById('days-container');
  if (!container) return;

  const dayData = data.slots && data.slots[dayName];
  const availableOnDay = dayData ? dayData.available : [];
  const prayerTimes = data.prayerTimes || {};

  const dayEl = element('div', { className: 'day' });

  const header = element('div', { className: 'day-header' });
  const nameEl = element('div', { className: 'day-name' }, dayName);
  const rangeEl = element('div', { className: 'day-range' });

  let rangeText = 'Outside teaching hours';
  if (dayName === 'Saturday') {
    rangeText = 'Available 4:45 PM – 11:45 PM Cairo time (after Asr prayer)';
  } else if (dayName === 'Sunday') {
    rangeText = 'Available 12:00 AM – 3:00 AM & 4:45 PM – 11:45 PM Cairo time';
  }
  rangeEl.textContent = rangeText;

  header.append(nameEl, rangeEl);
  dayEl.appendChild(header);

  const grid = element('div', { className: 'day-grid' });

  for (let i = 0; i < slotsPerDay; i++) {
    const slotData = slots[i];
    const slotEl = buildSlotElement(i, slotData.kind, dayName, availableOnDay, data, prayerTimes);
    grid.appendChild(slotEl);
  }

  dayEl.appendChild(grid);
  container.appendChild(dayEl);
}

function buildSlotElement(index, kind, dayName, availableOnDay, data) {
  const classes = ['slot'];
  let label = formatTimeSlotLabel(index);
  let ariaLabel = `Slot ${label} Cairo time`;

  if (kind === 'outside') {
    classes.push('slot--outside');
    ariaLabel += ' — outside teaching hours';
  } else if (kind === 'prayer') {
   classes.push('slot--prayer');
   const prayerName = prayerTimes ? (prayerTimes[String(index)] || 'Prayer break') : 'Prayer break';
   ariaLabel = `${prayerName} — Cairo time`;
   // Show only the prayer name in the tiny slot; the time is in the aria-label and the widget footer.
   const shortName = prayerName.split(' ')[0];  // "Asr", "Maghrib", "Isha"
   label = shortName;
 } else if (kind === 'unavailable') {
    classes.push('slot--unavailable');
    ariaLabel += ' — unavailable';
  } else if (kind === 'available') {
    // Mark as selectable.
    classes.push('slot--available');

    if (availableOnDay.includes(index)) {
      // This slot is in the pre-selected available set.
      // Keep it available for selection.
    }

    slotEl = element('button', {
      className: classes.join(' '),
      type: 'button',
      'aria-label': ariaLabel,
      'data-day': dayName,
      'data-slot': String(index),
      'data-aria-label': ariaLabel,
    }, label);
    slotEl.addEventListener('click', () => toggleSlotSelection(slotEl));
    return slotEl;
  }

  const slotEl = element('div', {
    className: classes.join(' '),
    'aria-label': ariaLabel,
    'data-day': dayName,
    'data-slot': String(index),
  }, label);

  return slotEl;
}

/* ---- Slot selection state (shared across both day rows) ---- */

const selectedSlots = new Map(); // key: "DayName:slotIndex" -> { day, index, cairoLabel }

function slotKey(day, index) {
  return `${day}:${index}`;
}

function toggleSlotSelection(el) {
  if (!el.classList.contains('slot--available')) return;

  const day = el.getAttribute('data-day');
  const index = parseInt(el.getAttribute('data-slot'), 10);
  if (isNaN(index)) return;

  const key = slotKey(day, index);

  el.classList.toggle('slot--selected');

  if (el.classList.contains('slot--selected')) {
    selectedSlots.set(key, { day, index, el });
  } else {
    selectedSlots.delete(key);
  }

  updateBookingButton();
}

function clearSelection() {
  for (const [, entry] of selectedSlots) {
    entry.el.classList.remove('slot--selected');
  }
  selectedSlots.clear();
  updateBookingButton();
}

function updateBookingButton() {
  const btn = document.getElementById('modal-send');
  if (btn) {
    btn.disabled = selectedSlots.size === 0;
    btn.style.opacity = selectedSlots.size === 0 ? '0.5' : '1';
    btn.style.cursor = selectedSlots.size === 0 ? 'not-allowed' : 'pointer';
  }
}

/* ---- Modal wiring ---- */

function setupModal(modal) {
  const openTriggers = document.querySelectorAll('.slot--available');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  const sendBtn = document.getElementById('modal-send');
  const nameInput = document.getElementById('modal-name');
  const subjectSelect = document.getElementById('modal-subject');
  const timezoneInput = document.getElementById('modal-timezone');
  const slotsTextarea = document.getElementById('modal-slots');
  const messageTextarea = document.getElementById('modal-message');
  const contactRadios = document.querySelectorAll('input[name="contact-method"]');

  if (!nameInput) return;

  // Prefill timezone.
  if (timezoneInput) {
    timezoneInput.value = getTimezoneName();
  }

  // Open modal from any available slot click (if not already selected logic).
  // We open the modal when the user has selected at least one slot and clicks Send,
  // or we also open after first selection? The UI: user selects slots on the grid,
  // then clicks "Book a Lesson" — but we don't have a separate open button.
  // Design: clicking an available slot selects it; there's a small "Book selected slots"
  // affordance. We'll add a floating "Book X slot(s)" trigger inside the widget foot
  // that only appears when slots are selected.
  attachFloatingBookTrigger();

  // Close handlers.
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
  }

  // Contact method changes rebuild the message.
  contactRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      rebuildMessage();
    });
  });

  // Subject / name changes rebuild the message.
  if (nameInput) nameInput.addEventListener('input', rebuildMessage);
  if (subjectSelect) subjectSelect.addEventListener('change', rebuildMessage);

  // Send.
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (selectedSlots.size === 0) return;
      sendBooking();
    });
  }

  // Initial build of message (empty selection).
  rebuildMessage();
}

function attachFloatingBookTrigger() {
  // Add a "Book N slot(s)" button inside the widget foot, shown only when
  // selections exist.
  const foot = document.querySelector('.widget-foot');
  if (!foot) return;

  const existing = foot.querySelector('.book-trigger');
  if (existing) existing.remove();

  const trigger = element('button', {
    className: 'btn btn-primary book-trigger',
    type: 'button',
    text: 'Book selected slots →',
  });

  trigger.style.display = 'none';
  trigger.addEventListener('click', openModal);

  // Watch selection changes to show/hide the trigger.
  foot.appendChild(trigger);

  // We'll update visibility inside updateBookingButton via a patch.
  const origUpdate = updateBookingButton;
  // Replace the function with one that also toggles the trigger.
  window.__bookTriggerUpdated = false;
  updateBookingButton = function () {
    origUpdate();
    if (trigger) {
      trigger.style.display = selectedSlots.size === 0 ? 'none' : 'inline-flex';
    }
  };
  // Re-run to set initial visibility.
  updateBookingButton();
}

function openModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal || selectedSlots.size === 0) return;

  // Set the slots textarea to the selected slots in the user's timezone.
  const slotsTextarea = document.getElementById('modal-slots');
  const timezoneInput = document.getElementById('modal-timezone');

  const lines = [];
  for (const [, entry] of selectedSlots) {
    const cairoTime = slotIndexToCairoTime(entry.index);
    const localTime = cairoToLocal(cairoTime.hours, cairoTime.minutes);
    lines.push(`${entry.day} — ${localTime.label} (Cairo: ${cairoTime.hours}:${String(cairoTime.minutes).padStart(2,'0')} ${cairoTime.hours < 12 ? 'AM' : 'PM'})`);
  }

  if (slotsTextarea) {
    slotsTextarea.value = lines.join('\n\n') || 'No slots selected';
  }
  if (timezoneInput) {
    timezoneInput.value = getTimezoneName();
  }

  rebuildMessage();
  modal.hidden = false;
  // Focus first interactive element.
  setTimeout(() => {
    const focusTarget = document.getElementById('modal-name') || document.querySelector('.modal-input');
    if (focusTarget) focusTarget.focus();
  }, 50);
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.hidden = true;
  clearSelection();
}

function rebuildMessage() {
  const nameInput = document.getElementById('modal-name');
  const subjectSelect = document.getElementById('modal-subject');
  const slotsTextarea = document.getElementById('modal-slots');
  const messageTextarea = document.getElementById('modal-message');
  const selectedMethodEl = document.querySelector('input[name="contact-method"]:checked');

  if (!messageTextarea) return;

  const name = (nameInput && nameInput.value.trim()) || '[Your name]';
  const subject = (subjectSelect && subjectSelect.value) || '[Subject]';
  const slash = (nameInput && nameInput.value.trim()) ? '' : '\n\n';

  // Selected slots text.
  let slotsBlock = '';
  if (slotsTextarea) {
    slotsBlock = slotsTextarea.value ? `\n\nSelected slots:\n${slotsTextarea.value}` : '';
  }

  const methodNote = selectedMethodEl
    ? getMethodNote(selectedMethodEl.value)
    : '';

  const template =
`Hello Ahmed,

I'd like to book a ${subject} lesson.${slash}My preferred time(s) in my local timezone:${slotsBlock}

${methodNote}Please confirm and let me know how to proceed.
Thank you.`;

  messageTextarea.value = template;
}

function getMethodNote(method) {
  switch (method) {
    case 'email':
      return 'Note: clicking "Send Message" will open your email app with this message pre-filled.';
    case 'whatsapp':
      return 'Note: clicking "Send Message" will open WhatsApp with this message pre-filled. Send it to +20 111 774 0036.';
    case 'telegram':
      return 'Note: Telegram doesn\'t support pre-filled messages from the web. Copy the message below and send it to @Alghoraib.';
    case 'preply':
      return 'Note: clicking "Send Message" will open my Preply profile. Send this message there or contact me via Preply.';
    default:
      return '';
  }
}

function sendBooking() {
  const methodEl = document.querySelector('input[name="contact-method"]:checked');
  const messageEl = document.getElementById('modal-message');
  if (!methodEl || !messageEl) return;

  const method = methodEl.value;
  const message = messageEl.value;
  const encoded = encodeURIComponent(message);

  closeModal();

  switch (method) {
    case 'email':
      window.location.href = `mailto:ahmed.alghoraib@gmail.com?subject=Lesson%20Booking%20Request&body=${encoded}`;
      break;
    case 'whatsapp':
      window.location.href = `https://wa.me/201117740036?text=${encoded}`;
      break;
    case 'telegram':
      // Telegram has no web "send a message with text" link that works reliably
      // from the browser to a user. Show the message + the handle, and instruct
      // the user to copy and send.
      showTelegramFallback(message);
      break;
    case 'preply':
      window.location.href = 'https://preply.in/AHMED6EN1434201102?ts=17924484';
      break;
    default:
      break;
  }
}

function showTelegramFallback(message) {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  // Replace the modal body with the Telegram copy prompt.
  const panel = modal.querySelector('.modal-panel');
  if (!panel) return;

  const oldBody = panel.querySelector('.modal-body');
  const copyNotice = element('div', { className: 'modal-body', html: '' });

  const title = element('h2', { className: 'modal-title', text: 'Copy your message' });
  const line1 = element('p', { className: 'modal-note', text: 'Telegram doesn\'t allow a web link to send a message with text. Copy the message below and send it to @Alghoraib on Telegram.' });
  const textarea = element('textarea', {
    className: 'modal-input modal-textarea',
    rows: 5,
    readonly: 'readonly',
  });
  textarea.value = message;
  textarea.style.fontFamily = 'inherit';
  textarea.style.fontSize = '15px';
  textarea.style.color = 'var(--color-text)';
  textarea.style.background = 'var(--color-bg)';
  textarea.style.border = '1px solid var(--color-border-strong)';
  textarea.style.borderRadius = '6px';
  textarea.style.padding = '9px 12px';
  textarea.style.width = '100%';
  textarea.style.resize = 'vertical';
  textarea.setAttribute('tabindex', '-1')
  textarea.value = message
  const copyBtn = element('button', {
    className: 'btn btn-primary',
    type: 'button',
    text: 'Copy message',
  });
  copyBtn.addEventListener('click', () => {
    textarea.select();
    try {
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = 'var(--color-accent)';
      setTimeout(() => {
        copyBtn.textContent = 'Copy message';
        copyBtn.style.background = '';
      }, 1200);
    } catch (e) {
      // Mobile may not support execCommand; user can long-press select.
    }
  });

  const closeLink = element('a', {
    className: 'btn btn-ghost',
    href: '#',
    text: 'Close',
  });
  closeLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  const actions = element('div', { className: 'modal-actions' }, copyBtn, closeLink);

  copyNotice.appendChild(title);
  copyNotice.appendChild(line1);
  copyNotice.appendChild(textarea);
  copyNotice.appendChild(actions);

  panel.innerHTML = '';
  panel.appendChild(copyNotice);

  setTimeout(() => textarea.focus(), 50);
}

/* ---- Cairo → local time conversion for the modal ---- */

function cairoToLocal(cairoHours, cairoMinutes) {
  // Build an ISO string in UTC that represents the same wall-clock time in Cairo.
  // Use a fixed anchor date (2026-09-28) to avoid DST ambiguity.
  const iso = `2026-09-28T${String(cairoHours).padStart(2,'0')}:${String(cairoMinutes).padStart(2,'0')}:00`
  const asUTC = new Date(iso + 'Z');

  // Now format that instant in the user's timezone.
  const userTZ = getTimezoneName();
  if (!userTZ || userTZ === 'Unknown') {
    return { label: `${cairoHours % 12 || 12}:${String(cairoMinutes).padStart(2,'0')} ${cairoHours < 12 ? 'AM' : 'PM'}` };
  }

  let localLabel;
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: userTZ,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(asUTC);
    const hour = parts.find(p => p.type === 'hour');
    const minute = parts.find(p => p.type === 'minute');
    const dayPeriod = parts.find(p => p.type === 'dayPeriod');
    localLabel = `${hour.value}:${minute.value} ${dayPeriod.value}`;
  } catch (e) {
    localLabel = `${cairoHours % 12 || 12}:${String(cairoMinutes).padStart(2,'0')} ${cairoHours < 12 ? 'AM' : 'PM'}`;
  }

  return { label: localLabel, cairo: `${cairoHours % 12 || 12}:${String(cairoMinutes).padStart(2,'0')} ${cairoHours < 12 ? 'AM' : 'PM'}` };
}

/* ---- Expose for debugging ---- */
if (typeof window !== 'undefined') {
  window.__availability = {
    loadAvailability,
    buildAvailabilityMap,
    selectedSlots,
    clearSelection,
    toggleSlotSelection,
    getTimezoneName,
    cairoToLocal,
  };
}
