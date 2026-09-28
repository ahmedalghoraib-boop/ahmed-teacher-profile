# Teacher Website — Progress & Next Steps

> Living doc. Updated at each milestone. Companion to KEY_INSTRUCTIONS.md.

## Milestone summary

### Done

**1. Interview (2026-09-28)**
- 10-question teacher-profile interview completed.
- All answers captured; nothing invented — every field traces to an answer.
- Open questions resolved: name (Ahmed Alghoraib), contact values (saved to Mnemosyne), theme (see-it-first), draft intro (approved with edits), availability window (weekends 4 PM→3 AM Cairo), grid design (24h × 15-min slots, prayer breaks carved, 15-min minimum), booking flow (select slots → modal → contact method → pre-filled message), template message + contact-method behavior (agreed).

**2. Site build (local, /tmp/ahmed-teacher-profile/)**
- `index.html` — homepage.
- `availability.html` — availability page with the timezone widget.
- `style.css` — shared styles.
- `script.js` — shared JS + availability data + widget logic.
- `availability.json` — slot/prayer data (also embedded in `script.js` as inline fallback, kept in sync).
- `assets/favicon.svg` — star/crescent favicon.
- Prayer break logic fixed: 3 slots each for Asr/Maghrib/Isha on both Saturday and Sunday, 45 min each (4:13 PM, 6:46 PM, 8:04 PM Cairo).
- Prayer slot labels shortened to just the prayer name so they fit in the small slots.
- English level set to "Fluent (near C1)" on the site.
- Availability data verified clean: Saturday 23 available + 9 prayer breaks, Sunday 35 available + 9 prayer breaks, 0 overlap, all breaks accounted for.

**3. Project setup (2026-09-28)**
- Project "Teacher Website" created in Hermes (id `p_846316fe`, slug `teacher-website`, anchored at `/Users/ahmed.alghoraib/Teacher-Website`).
- Session moved into the project.
- `KEY_INSTRUCTIONS.md` written — single source of truth for all interview data, decisions, and instructions.
- Global git config present: `Ahmed Alghoraib` / `Ahmed.alghoraib@gmail.com`.

**4. Review server (2026-09-28)**
- Local HTTP server running on `http://localhost:8080` serving the build from `/tmp/ahmed-teacher-profile/`.
- `http://localhost:8080/index.html` — homepage.
- `http://localhost:8080/availability.html` — availability page.

### Not done

**A. Visual review — WAITING ON AHMED**
- Server is live; Ahmed hasn't confirmed whether the build looks right.
- Until confirmed: no further site edits, no push.

**B. Move build into project dir — NOT YET DONE**
- Build currently lives in `/tmp/ahmed-teacher-profile/`.
- Needs to move into `/Users/ahmed.alghoraib/Teacher-Website/` (project dir).
- Only AFTER Ahmed confirms the visual review.

**C. Git init + first commit — NOT YET DONE**
- Git not initialized in the project dir.
- No commit yet.

**D. GitHub repos + push — NOT YET DONE**
- `ahmedalghoraib-boop/ahmed-teacher-profile` does not exist on GitHub yet.
- `ahmedalghoraib-boop/teaching-materials` does not exist on GitHub yet.
- Nothing pushed anywhere.

**E. Materials repo structure — NOT YET DONE**
- Skeleton only (per-subject folders); no real materials added.
- Ahmed adds real materials later.

---

## Next steps (in order)

1. **Ahmed reviews the live build** at `http://localhost:8080` (homepage + availability page). Tell me what to change, or say "push".
2. **Move build into project dir** (`/Users/ahmed.alghoraib/Teacher-Website/`) — only after visual approval.
3. **Git init + first commit** in the project dir.
4. **Create GitHub repos** `ahmedalghoraib-boop/ahmed-teacher-profile` and `ahmedalghoraib-boop/teaching-materials` (public).
5. **Push** site to `ahmed-teacher-profile`, materials skeleton to `teaching-materials`.
6. **GitHub Pages** enable on `ahmed-teacher-profile` (if not auto-enabled by the push to main/docs).
7. **Update PROGRESS.md** after each step above.

---

## Decisions log (brief)

| Decision | Value | Source |
|---|---|---|
| Site language | English only | Ahmed |
| Theme | warm cream + teal accent, Cormorant Garamond + Source Sans 3, subtle geometric tile + star/crescent SVG | Draft by me, pending Ahmed visual approval |
| Availability model | Option A — external JSON fetched by static page, updatable by Ahmed pushing the JSON | Ahmed |
| Prayer breaks | Asr 4:13 PM, Maghrib 6:46 PM, Isha 8:04 PM Cairo, 45 min each | Ahmed (Google Cairo times) |
| Min session | 15 minutes | Ahmed |
| Booking flow | select slots → modal → contact method → pre-filled message | Ahmed |
| Contact methods | Email (mailto), WhatsApp (wa.me link), Telegram (t.me + copy), Preply (profile link) | Ahmed |
| English level on site | "Fluent (near C1)" | Ahmed |
| Pricing | Off the site, private | Ahmed |
| Materials repo organization | Per subject | Ahmed |

---

*Last updated: 2026-09-28. Next update: after Ahmed reviews the live build.*
