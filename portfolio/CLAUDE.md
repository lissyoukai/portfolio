# Liss — portfolio site

Personal portfolio of Liss (Elizaveta Maslichenko), product designer. Static site deployed on Vercel from GitHub.
Owner designs in Paper (paper.design), then the design is moved into code. Talk to her in Russian, casually; she is a designer, explain code decisions in plain words.

## Structure
- `index.html` — home page (header, hero, 3 case cards, footer)
- `styles.css` — all styles; tokens in `:root` at the top
- `main.js` — translations (I18N), mobile menu, ASCII night sky, entrance animation, hover pill on covers, sounds
- `assets/` — images (webp/png). Short videos also go here as compressed `.mp4` (H.264, 1–3 MB, muted loop)

## Design tokens
- Fonts: Funnel Display (display/UI), Geist (body text, also fallback for Cyrillic), Fragment Mono (ASCII sky). Google Fonts.
- Text #242424, muted description #898787, labels #969696, accent #6651E2
- Content width 948px (+32px gutters), header 60px sticky with blur
- Tags: lavender `rgba(207,209,255,.45)` for Tullysub, blue `rgba(224,238,255,.51)` for B2B cases
- Pill style (EN/RU switch, cover hover pill): outer grey capsule `rgba(232,232,232,.6)` with white inner capsule + soft shadow
- Breakpoints: ≤1012px tablet, ≤720px mobile (nav goes into burger menu)

## Decisions already made (keep them)
- **RU translation covers only the three case descriptions.** Everything else stays English. `I18N.ru` holds only `*.desc` keys; missing keys fall back to EN.
- **Night sky** (canvas, `buildSky`/`draw` in main.js): background = only `⊹`, color #AFB3F0, fixed seeded clusters (not random per load). Moon = crescent from a photo, 36×22 grid (`MOON_LUM`), glyphs `⁺ ⊹ ✧ ⋆ ✦ ✻`, gradient #462DE3 (to 65%) → #AFB3F0 (100%), blurred glow layer under it. Moon is positioned relative to the avatar. Cursor softly fades stars out (they return after ~0.8s); on the moon glyphs swap to other moon glyphs instead of disappearing.
- **Entrance animation**: staggered fade-up + blur, `--reveal-dur: 1.5s` in styles.css; delays in `setupReveal()`. Disabled for prefers-reduced-motion.
- **Sounds**: soft haptic taps synthesized with Web Audio (style of derkachcreate.com): sine 620→360 Hz, lowpass 860 Hz. Double tap on hover, single tap on click. No audio files. She tried an extra "bloop" on click and removed it — don't add it back.
- **Cover hover pill** follows cursor: "Open case ↗"; FEFUone shows "Case in progress" with pulsing dot.
- Case order: Tullysub (first, pet project, strongest visual) → FEFUone · Event Builder (real product, in progress) → GeologyScience.ru. GeologyScience icon "GS" is a placeholder.

## Contacts
- Telegram: https://t.me/maslichenko
- Email: maslicenkoelizaveta306@gmail.com (copy-to-clipboard instead of mailto)
- CV: https://drive.google.com/drive/folders/1ysAbwX6BKKPw4SbuWh8XuGzZsaMUZQj8

Done: pill contacts under the hero (Telegram ↗, Email copy, CV ↗) + "Contact" in the header opens a popover card (Paper "navbar" 518px: label "main contacts" left, row-pills right). On mobile the burger opens the same card (Paper "navbar" 375px): "navigation" (Work) + "main contacts". Icons are an inline SVG sprite at the top of index.html (`#i-telegram`, `#i-at`, `#i-doc`, `#i-work`, `#i-arrow`, `#i-copy`, `#i-check`) — her Paper mockup pulls them from hanumatori.com, don't hotlink those. No separate contacts page. About link is not added yet (no page).

## Next steps
1. About page/link.
2. Case page for Tullysub: Paper → adaptive → code. Its structure becomes the template for other cases.
3. GeologyScience case page with short interface videos.
4. Consider moving to Astro to share header/footer between pages (Vercel supports Astro natively).

## Paper
Current file "Motivated lemon", id `01M5WE42WREC7Z7BC7S0ADXXAJ` (older: "UPDATE PORTFOLIO" `01M3KTQF62FB5FR59G1KBCWVW9`). Footer = node "Footer Bar", but on the site it has NO background and NO shadow — it is part of the page, stars continue under it (her decision). Artboards: "Home — EN" (desktop 1200) and "Home — EN · Mobile" (375). Layer names are English, by hierarchy.

## Deploy
Edit → Source Control: commit → Sync Changes → Vercel redeploys automatically.
