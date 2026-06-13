/* ===== Wat Dog Groomers — interactivity ===== */

// --- Config: opening hours ---
// Currently open Sundays 9am–12pm in 1-hour slots. To change days/times later,
// edit OPENING_DAYS (0=Sun, 1=Mon … 6=Sat) and the TIME_SLOTS array.
const OPENING_DAYS = [0]; // Sunday
const TIME_SLOTS = ['9:00 am', '10:00 am', '11:00 am'];

// --- Existing bookings (slots already taken) ---
// date: YYYY-MM-DD · start/end define the booked window. Any slot that overlaps
// the window is shown as booked. Add a line here for each new booking.
const BOOKINGS = [
  { date: '2026-06-14', start: '9:00 am', end: '10:00 am', name: 'Ally' },
  { date: '2026-06-14', start: '10:00 am', end: '11:00 am', name: 'Winston' },
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupMobileNav();
  setupCalendar();
});

/* ---------- Mobile nav ---------- */
function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- Time helpers ---------- */
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLOT_MINUTES = 60;

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// "9:30 am" -> minutes since midnight
function toMinutes(label) {
  const m = label.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!m) return 0;
  let hour = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) hour += 12;
  return hour * 60 + parseInt(m[2], 10);
}

// Returns the booking covering a given slot on a date, or null
function bookingFor(date, slotLabel) {
  const day = isoDate(date);
  const start = toMinutes(slotLabel);
  const end = start + SLOT_MINUTES;
  return BOOKINGS.find((b) =>
    b.date === day && start < toMinutes(b.end) && end > toMinutes(b.start)
  ) || null;
}

function openSlotCount(date) {
  return TIME_SLOTS.filter((s) => !bookingFor(date, s)).length;
}

/* ---------- Availability calendar (week view) ---------- */
function setupCalendar() {
  const week = document.getElementById('cal-week');
  const title = document.getElementById('cal-title');
  if (!week || !title) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start the view on the Sunday of the current week
  let viewStart = new Date(today);
  viewStart.setDate(today.getDate() - today.getDay());

  let selectedKey = isoDate(today); // auto-select today if it's open

  function render() {
    week.innerHTML = '';
    const weekEnd = new Date(viewStart);
    weekEnd.setDate(viewStart.getDate() + 6);
    title.textContent = `${viewStart.getDate()} ${MONTHS[viewStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

    let selectedDate = null;

    for (let i = 0; i < 7; i++) {
      const date = new Date(viewStart);
      date.setDate(viewStart.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';

      const isOpenDay = OPENING_DAYS.includes(date.getDay());
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const openCount = isOpenDay ? openSlotCount(date) : 0;

      let tag = 'Closed';
      if (isOpenDay && !isPast) tag = openCount ? `${openCount} free` : 'Full';
      else if (isOpenDay && isPast) tag = '—';

      cell.innerHTML =
        `<span class="cal-day-name">${WEEKDAYS[date.getDay()]}</span>` +
        `<span class="cal-day-num">${date.getDate()}</span>` +
        `<span class="cal-day-tag">${tag}</span>`;

      if (isToday) cell.classList.add('today');

      if (isPast) {
        cell.classList.add('past');
        cell.disabled = true;
      } else if (isOpenDay) {
        cell.classList.add('open');
        if (openCount === 0) cell.classList.add('full');
        if (isoDate(date) === selectedKey) {
          cell.classList.add('selected');
          selectedDate = date;
        }
        cell.addEventListener('click', () => {
          selectedKey = isoDate(date);
          render();
        });
      } else {
        cell.classList.add('closed');
        cell.disabled = true;
      }
      week.appendChild(cell);
    }

    if (selectedDate) showSlots(selectedDate);
    else clearSlots();
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    viewStart.setDate(viewStart.getDate() - 7);
    render();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    viewStart.setDate(viewStart.getDate() + 7);
    render();
  });

  render();
}

function clearSlots() {
  document.getElementById('slots-title').textContent = 'Select a day';
  document.getElementById('slots-hint').textContent =
    'Click an available (highlighted) day to see open times.';
  document.getElementById('slots-list').innerHTML = '';
}

function showSlots(date) {
  const list = document.getElementById('slots-list');
  const title = document.getElementById('slots-title');
  const hint = document.getElementById('slots-hint');

  const dateLabel = `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
  title.textContent = dateLabel;
  hint.textContent = openSlotCount(date)
    ? 'Choose a time — we’ll pop it into the booking form.'
    : 'Fully booked — try another Sunday using the ‹ › arrows.';

  list.innerHTML = '';
  TIME_SLOTS.forEach((time) => {
    const booked = bookingFor(date, time);
    if (booked) {
      const div = document.createElement('div');
      div.className = 'slot-booked';
      div.innerHTML = `<span class="slot-time">${time}</span> — Booked${booked.name ? ` (${booked.name})` : ''}`;
      list.appendChild(div);
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.innerHTML = `<span class="slot-time">${time}</span> — book this slot`;
      btn.addEventListener('click', () => chooseSlot(`${dateLabel}, ${time}`, list));
      list.appendChild(btn);
    }
  });
}

function chooseSlot(slotText, list) {
  const input = document.getElementById('preferred');
  if (input) input.value = slotText;

  list.innerHTML = `<div class="slot-confirm">✅ <strong>${slotText}</strong> added to your booking form below.</div>`;

  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  if (input) setTimeout(() => input.focus({ preventScroll: true }), 500);
}
