# Teacher Website — Key Instructions & Interview Data

> Living reference. Updated as we go. Single source of truth for this project.

## 0. Project identity

- **Project name:** Teacher Website
- **Owner:** Ahmed Alghoraib
- **GitHub account:** `ahmedalghoraib-boop` (PAT in `~/.hermes/.env` — `GITHUB_TOKEN` + `GITHUB_PAT` both present; `gh` CLI already logged in locally as `ahmedalghoraib-boop`)
- **Home dir:** `/Users/ahmed.alghoraib`
- **Project dir:** `/Users/ahmed.alghoraib/Teacher-Website` (created 2026-09-28)
- **Local build dir (scratch, move to project dir before push):** `/tmp/ahmed-teacher-profile/`

---

## 1. Who this is for

- **Name on site:** Ahmed Alghoraib
- **Teaches:** Arabic for English speakers; Quran memorization techniques; Tajweed (beginner / intermediate / advanced); Reading Arabic for kids; Islamics
- **Audience:** ages 6–40, primarily US, also UK and Australia; English-proficient; Muslims and non-Muslims interested in Islamic culture
- **Format:** fully remote — 1-on-1 online; group classes on Zoom when preferable; never in person
- **Session length:** 30–60 minutes, depending on the client's request
- **Pricing:** handled privately — NOT on the website

---

## 2. Teaching approach (from interview)

### Arabic lesson

1. Warm-up — mimic a simple Arabic conversation, matched to the student's level.
2. Lesson from the book **العربية بين يديك** (*Al-Arabiyyah Bayna Yadayk*).
3. Ahmed is flexible on method — ready to adapt pace, style, materials, and balance of Arabic vs English.

### Quran session

1. Review previously memorized portions first.
2. Correct mistakes Ahmed chose not to correct on the spot.
3. Have the student recite the newly memorized portion.
4. Repeat the ayahs with a lot of mistakes.
5. Introduce new surah/ayah and assign memorization for next time.
6. If a student requires it, assign part of the class to Tajweed lessons and implications.
7. Sometimes the Tajweed instruction happens alongside memorization.

### Tajweed

- Separate theory slot when a student needs it; often alongside memorization.

### General method notes

- Ahmed is ready to adapt and use all suggested methods.
- Pace, style, materials, and level of Arabic vs English are all adjustable — concrete details matter for the site copy.

---

## 3. Credentials

- Ijazah
- Degree from Cairo University for teaching Arabic to non-Arabs
- 2 years experience (no formal training)
- **English:** Fluent (near C1) — EF SET certificate covers Listening and Reading; Speaking self-evaluated between B2–C1 because EF SET doesn't test speaking. Phrase to use on site: **"Fluent (near C1)"**

---

## 4. Availability

- **Weekends only** — Saturday and Sunday.
- **Window (Cairo time):** 4 PM → 3 AM Cairo time. Interpreted as two day-rows on the widget:
  - Saturday: 4 PM → 11:45 PM (slots 64–95) — plus the after-midnight part belongs to Sunday's row.
  - Sunday: 12:00 AM → 3:00 AM (slots 0–11) AND 4 PM → 11:45 PM (slots 64–95).
- **Slot grid:** 24 hours per day, divided into 15-minute slots (96 slots per day).
- **Minimum session:** 15 minutes.
- **Timezone display:** widget converts and shows times in the student's own timezone; Ahmed keeps his schedule in Cairo time.
- **Dynamic update model (Option A, chosen by Ahmed):** the availability data lives in an external file (JSON) that the static page fetches on load. Ahmed updates the JSON and pushes — students see the new grid on refresh. No server needed now; can move to a server later.

---

## 5. Prayer times (Cairo, from Google, as stated by Ahmed 2026-09-28)

| Prayer | Cairo time | Break length |
|---|---|---|
| Fajr | 5:22 AM | — (outside teaching window) |
| Sunrise | 6:49 AM | — (outside teaching window) |
| Dhuhr | 12:48 PM | — (outside teaching window) |
| Asr | 4:13 PM | 45 minutes |
| Maghrib | 6:46 PM | 45 minutes |
| Isha | 8:04 PM | 45 minutes |

- Each prayer break = 45 minutes = 3 consecutive 15-minute slots.
- Fajr, Sunrise, Dhuhr fall outside the 4 PM–3 AM teaching window, so they don't block any slot on the grid.
- **Asr break:** slots 64, 65, 66 (4:00 PM–4:45 PM Cairo)
- **Maghrib break:** slots 75, 76, 77 (6:45 PM–7:30 PM Cairo)
- **Isha break:** slots 80, 81, 82 (8:00 PM–8:45 PM Cairo)
- These are pre-filled in `availability.json` and reflected in the widget.

---

## 6. Contact info (saved to Mnemosyne, id `f1f563ac94de42ba`)

- **Email:** ahmed.alghoraib@gmail.com
- **Telegram:** @Alghoraib
- **WhatsApp:** 01117740036
- **Preply profile:** https://preply.in/AHMED6EN1434201102?ts=17905441 (Ahmed's actual active Preply profile — confirmed)

All four wanted on the site.

---

## 7. Booking flow (widget behavior, agreed with Ahmed)

1. Student sees the 24-hour × 15-minute grid for Saturday and Sunday.
2. Available slots are highlighted/tappable. Prayer breaks are greyed out with a label (Asr / Maghrib / Isha) and the Cairo time in the tooltip.
3. Student clicks one or more available slots to select them.
4. When one or more slots are selected, a "Book" action appears.
5. Clicking Book opens a modal where the student:
   - enters name (optional/required — TBD)
   - picks a subject
   - sees the selected slots listed in their local timezone
   - picks a contact method (Email / WhatsApp / Telegram / Preply)
   - sends a pre-filled message with the chosen times.
6. **Contact method behavior (agreed with Ahmed):**
   - **Email:** opens `mailto:` with the message pre-filled in the body.
   - **WhatsApp:** opens `https://wa.me/201117740036?text=<URL-encoded message>`.
   - **Telegram:** opens `t.me/Alghoraib` + a copyable message (Telegram doesn't support a web "send pre-filled message to a user" link — honest behavior, not faked).
   - **Preply:** opens the Preply profile URL.
7. **Template message (agreed with Ahmed):**
   > Hello Ahmed,
   >
   > I'd like to book an Arabic/Quran lesson. My preferred time(s) in my local timezone:
   > [slot 1], [slot 2], …
   >
   > Please confirm and let me know how to proceed.
   > Thank you.

---

## 8. Website language & theme

- **Language:** English only.
- **Theme direction (drafted, awaiting visual confirmation):** warm cream/sand background, deep teal accent, charcoal text, muted text. Headings in Cormorant Garamond, body in Source Sans 3 (both Google Fonts, free). Light geometric tile pattern as CSS background on header/footer (subtle, low opacity). Small inline SVG star/crescent mark as favicon and as a small footer accent. Not kitschy — modern, clean, organized, detailed-orientated. Ahmed said he wants to see it before deciding, so the real test is opening the local build.

---

## 9. Materials repo

- **Organized per subject** (Ahmed's instruction).
- **Purpose:** backup for Ahmed's teaching materials + downloadable by anyone.
- **Formats assumed (to be populated by Ahmed later):** PDF, PPTX, MP3, JSON.
- No real materials added yet — structure only.

---

## 10. Repos (planned)

- `ahmedalghoraib-boop/ahmed-teacher-profile` — GitHub Pages site → `https://ahmedalghoraib-boop.github.io/ahmed-teacher-profile/`
- `ahmedalghoraib-boop/teaching-materials` — materials backup + download → `https://github.com/ahmedalghoraib-boop/teaching-materials`

Repo names can be renamed before first push if Ahmed wants.

---

## 11. Files built so far (local scratch — NOT yet in project dir, NOT yet pushed)

From `/tmp/ahmed-teacher-profile/`:

- `index.html` — homepage
- `availability.html` — availability page with widget
- `style.css` — shared styles
- `script.js` — shared JS + availability data + widget logic
- `availability.json` — slot/prayer data (also embedded in `script.js` as inline fallback)
- `assets/favicon.svg` — star/crescent favicon

**Verified clean (2026-09-28):**
- Saturday: 23 available slots, 9 prayer-break slots, 0 overlap, all breaks accounted for.
- Sunday: 35 available slots, 9 prayer-break slots, 0 overlap, all breaks accounted for.
- Prayer labels in grid: Asr 4:13 PM (slots 64/65/66), Maghrib 6:46 PM (75/76/77), Isha 8:04 PM (80/81/82).

**Server live on port 8080** (started 2026-09-28):
- `http://localhost:8080/index.html`
- `http://localhost:8080/availability.html`

---

## 12. Open decisions / things to resolve before push

- Visual direction of the theme — Ahmed wants to see it first. (Server is live; open the URLs above and tell me what to change.)
- Whether the inline fallback data in `script.js` should stay in sync with `availability.json` long-term — currently they match, but any future edit to one must update the other unless we drop the fallback.
- Materials repo structure details — per subject is settled; exact sub-structure (per level? per lesson? per file type?) is TBD and can be Ahmed's call when he adds files.
- Whether to put a short "availability updates when I update my schedule — refresh the page to see the latest" note — already in the availability page.
- Anything else Ahmed spots when he reviews the live local build.

---

## 13. Done so far (summary — see also PROGRESS.md)

- 10-question interview completed (2026-09-28).
- Open questions from interview resolved:
  - Q1: Ahmed Alghoraib
  - Q2: contact values saved to Mnemosyne
  - Q3: theme choice deferred to "see it first"
  - Q4: draft intro written; Ahmed approved with edits (pace/style/materials/Arabic-vs-English added; non-Muslim welcome stated but not loud; degree wording kept as-is)
  - Q5: weekends 4 PM → 3 AM Cairo
  - A/B/C: 24h grid, prayer breaks carved (45 min each), 15-min minimum
  - M1/M2: template message + contact-method behavior agreed
- Prayer times updated to real Cairo times (Asr 4:13 PM, Maghrib 6:46 PM, Isha 8:04 PM, 45 min each).
- English level set to "Fluent (near C1)" on the site.
- Widget prayer breaks fixed: 3 slots each for Asr/Maghrib/Isha on both Saturday and Sunday.
- `availability.json` + inline fallback in `script.js` both kept in sync.
- Prayer slot labels shortened to just the prayer name ("Asr"/"Maghrib"/"Isha") so they fit in the small slots.
- Site files built and verified locally.
- Local HTTP server running on port 8080 for review.
- **NOT done:** GitHub repos not yet created; nothing pushed; project dir created but site files not yet moved into it.

---

*Last updated: 2026-09-28. Next update: after Ahmed reviews the live build and before any GitHub push.*
