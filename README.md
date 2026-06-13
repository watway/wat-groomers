# Wat Dog Groomers — website

A warm, friendly single-page site for Wat Dog Groomers (Bayside, Brisbane). Plain
HTML/CSS/JS — no build step. Open `index.html` in a browser, or host the folder
on Netlify, GitHub Pages, Cloudflare Pages, or any static host.

> Note: this is a **parody / for-fun** site for two real dogs (Winston & Ally),
> not an actual grooming business.

## Deploy (GitHub Pages)

Hosted via GitHub Pages from the `main` branch root:

1. Repo **Settings → Pages**
2. **Source**: Deploy from a branch
3. Branch **`main`**, folder **`/ (root)`** → Save

Live at **https://watway.github.io/wat-groomers/** — redeploys automatically on
every push to `main`. (Requires a public repo on the free tier.)

## Files
- `index.html` — page content and structure
- `styles.css` — theme and layout
- `script.js` — mobile nav + availability calendar

## Things to customise (placeholders are marked below)

| What | Where | Current placeholder |
|------|-------|---------------------|
| Phone number | `index.html` (search `(07) 0000 0000` / `tel:+61700000000`) | placeholder |
| Email | `index.html` (search `hello@watdoggroomers.com.au`) | placeholder |
| Prices | `index.html` — `#services` section (`from $XX`) | rough guides |
| Tagline | `index.html` — `.tagline` and footer | "Dog pampering done dirt cheap" |
| Hours / open days | `script.js` — `OPENING_DAYS` and `TIME_SLOTS` | Sundays 9/10/11am |

## Making the contact form actually send email

A static site can't send email by itself. The form is pre-wired for
[Formspree](https://formspree.io) (free tier):

1. Create a free Formspree account and a new form.
2. Copy your form's endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, replace `https://formspree.io/f/your-form-id` in the
   `<form action="...">` with your endpoint.

Prefer Netlify? Host on Netlify and add `netlify` to the `<form>` tag instead —
ask and I'll switch it over.

## Calendar

A **week view** generated in the browser from your opening hours
(`OPENING_DAYS` / `TIME_SLOTS` in `script.js`, currently Sundays in 30-min slots).
Open days are highlighted and show how many slots are free; clicking a day lists
its times, and choosing one prefills the booking form. Use the ‹ › arrows to move
between weeks.

### Marking a slot as booked
Add an entry to the `BOOKINGS` array in `script.js`. Any 30-minute slot that
overlaps the window shows as "Booked":

```js
const BOOKINGS = [
  { date: '2026-06-14', start: '9:30 am', end: '10:30 am', name: 'Winston' },
];
```

It's a presentation/booking-request calendar — bookings are entered by hand here,
not stored live. For real two-way booking, options include Calendly, Square
Appointments, or Fresha.
