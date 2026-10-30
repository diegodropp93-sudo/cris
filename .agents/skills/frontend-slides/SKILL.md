---
name: frontend-slides
description: >-
  Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files.
  Use when the user wants to build a presentation, convert a PPT/PPTX to web, or create slides for a talk/pitch.
  Helps non-designers discover their aesthetic through visual exploration rather than abstract choices.
---

# Frontend Slides

Create zero-dependency, animation-rich HTML presentations that run entirely in the browser.

## Core Principles

1. **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools.
2. **Show, Don't Tell** — Generate visual previews, not abstract choices. People discover what they want by seeing it.
3. **Distinctive Design** — No generic "AI slop." Every presentation must feel custom-crafted.
4. **Progressive Disclosure** — Read lightweight style indexes first. For bold templates, use small preview cards for style previews and load the full `design.md` only after the user picks that template.
5. **Fixed 16:9 Stage (NON-NEGOTIABLE)** — Every deck uses a 1920×1080 slide canvas scaled as a whole to the viewport. Slides must stay 16:9 on every screen, including phones. Do not reflow slide content to fit the device.

## Design Aesthetics

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight.

Focus on:
- **Typography:** Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- **Color & Theme:** Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- **Motion:** Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions.
- **Backgrounds:** Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

## Fixed Stage Rules

These invariants apply to EVERY slide in EVERY presentation:
- Every deck has a viewport wrapper that fills the browser window.
- Every slide is authored inside a fixed 1920×1080 stage.
- The stage scales uniformly to fit the viewport. It may letterbox/pillarbox; it must not re-layout content.
- Do not use responsive breakpoints to rearrange slide content for phones.
- Use fixed internal slide measurements at the 1920×1080 design size.
- Slide visibility must be controlled by `.active` / `.visible` using `visibility`, `opacity`, and `pointer-events` from `viewport-base.css`. Do not use `display: none` / `display: block` for slide switching.
- Use `clamp()` only for non-slide UI outside the stage.
- Include `prefers-reduced-motion` support.
- Never negate CSS functions directly (`-clamp()`, `-min()`, `-max()`) — use `calc(-1 * clamp(...))` instead.

**When generating, read `viewport-base.css` and include its full contents in every presentation.**

### Content Density Modes

Ask the user whether this is primarily a reading deck or a speaking deck, then design around that answer:

| Density mode | Best for | Design behavior |
| ------------- | -------- | --------------- |
| **Low density / speaker-led** | Public talks, keynote-style sharing, live explanation | One idea per slide, large type, strong visual hierarchy, generous negative space, 1-3 bullets max |
| **High density / reading-first** | Reports, handouts, async review, detailed internal docs | More self-contained slides, structured grids/tables/annotations, 4-8 bullets or 4-6 cards |

---

## Phase 0: Detect Mode

Determine what the user wants:
- **Mode A: New Presentation** — Create from scratch. Go to Phase 1.
- **Mode B: PPT Conversion** — Convert a .pptx file. Go to Phase 4.
- **Mode C: Enhancement** — Improve an existing HTML presentation. Read it, understand it, enhance.

---

## Phase 1: Content Discovery (New Presentations)

Ask all questions together concisely:
1. **Purpose:** What is this presentation for? (Pitch deck / Teaching-Tutorial / Conference talk / Internal presentation)
2. **Length:** Approximately how many slides? (Short 5-10 / Medium 10-20 / Long 20+)
3. **Content:** Do you have content ready? (All content ready / Rough notes / Topic only)
4. **Density:** How dense should the deck feel? (Low density / speaker-led vs High density / reading-first)

---

## Phase 2: Style Discovery (Show, Don't Tell)

Generate 3 distinct single-slide HTML previews (`style-a.html`, `style-b.html`, `style-c.html`) in `.frontend-slides/slide-previews/`:
1. 1 safe preset from `STYLE_PRESETS.md`
2. 1 bold design system / template
3. 1 custom wildcard design tailored to the user's topic

Ask the user to pick their favorite visual direction before building the complete presentation.

---

## Phase 3: Generate Presentation

Build the full presentation in a single self-contained HTML file:
- Include the complete `viewport-base.css` rules.
- Implement the `SlidePresentation` JavaScript class with keyboard (<kbd>→</kbd>, <kbd>←</kbd>, <kbd>Space</kbd>) and touch swipe navigation.
- Implement inline editing (<kbd>E</kbd> key or hovering over hotzone).
- Follow all 1920×1080 stage rules.

---

## Supporting Files

| File | Purpose | When to Read |
| :--- | :--- | :--- |
| [STYLE_PRESETS.md](./STYLE_PRESETS.md) | 12 curated visual presets with colors, fonts, and signature elements | Phase 2 (style selection) |
| [viewport-base.css](./viewport-base.css) | Mandatory fixed-stage CSS — copy into every presentation | Phase 3 (generation) |
| [html-template.md](./html-template.md) | HTML structure, JS features, code quality standards | Phase 3 (generation) |
| [animation-patterns.md](./animation-patterns.md) | CSS/JS animation snippets and effect-to-feeling guide | Phase 3 (generation) |
