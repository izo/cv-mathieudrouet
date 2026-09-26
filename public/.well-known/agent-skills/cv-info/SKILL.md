---
name: cv-info
description: Retrieve CV, biography, experience, skills, and contact information for Mathieu Drouet, Chief AI, Technology & Product Officer (CATPO) based in Lille, France. Available in French and English.
version: 1.2.0
license: CC-BY-4.0
---

# cv-info — Mathieu Drouet CV access

Use this skill when an agent (or downstream user) wants to read, summarize, or answer questions about Mathieu Drouet — his professional experience, skills, current focus, or how to contact him.

## When to use

- A user asks about Mathieu Drouet's background, experience, or current role.
- An agent needs a structured CV to evaluate a candidate or prepare an introduction.
- A user wants to download the CV or get in touch.

## How to use

All resources are static, public, no authentication. Prefer Markdown for parsing; fall back to PDF only when a human-readable formatted version is needed.

### 1. Full CV (Markdown)

```
GET https://cv.drouet.io/cv.md
Accept: text/markdown
```

Returns the full CV in Markdown, with frontmatter (`name`, `title`, `description`, `theme`, `iconSet`). Inline icons follow the pattern `**carbon:icon-name**` and can be stripped or ignored — they are decorative.

### 1b. Full CV in English (Markdown)

```
GET https://cv.drouet.io/en/cv.md
Accept: text/markdown
```

Same CV, English version. Section headings are `Contact`, `Interests`, `Experience`, `Skills`, `Education`.

### 2. About / long-form bio (Markdown)

```
GET https://cv.drouet.io/about.md
Accept: text/markdown
```

Returns Mathieu's longer-form positioning across Product, Technology and AI, including AI architecture, agentic systems and hands-on delivery.

### 2b. About in English (Markdown)

```
GET https://cv.drouet.io/en/about.md
Accept: text/markdown
```

### 3. CV (PDF)

French:
```
GET https://cv.drouet.io/CV-Mathieu-Drouet-FR.pdf
```

English:
```
GET https://cv.drouet.io/CV-Mathieu-Drouet-EN.pdf
```

The PDFs are generated automatically from the rendered bilingual CV after content changes.

### 4. Homepage content negotiation

```
GET https://cv.drouet.io/
Accept: text/markdown
```

When `Accept: text/markdown` is sent, the homepage returns the CV in Markdown instead of the HTML rendering. Browsers continue to get HTML. The same applies to `/about`, `/en/` and `/en/about`, each returning its own language.

### 5. Contact

- Email: `m@mdr.cool`
- LinkedIn: https://www.linkedin.com/in/mathieudrouet/
- The site exposes WebMCP tools (`open_contact_form`, `download_cv_pdf`, `get_cv_markdown`) via `navigator.modelContext` when loaded in a browser.

## Content preferences

Per `https://cv.drouet.io/robots.txt`:

- `search=yes` — indexing for search is welcome.
- `ai-train=no` — please do **not** use this content to train models.
- `ai-input=yes` — using this content as live grounding (RAG, conversational answers) is welcome.

## Notes for agents

- The site is published in French (default, at `/`) and in English (at `/en/`). Both describe the same profile; if the two ever diverge, the French version prevails.
- Pick the language that matches the user's; when in doubt, `cv.md` (French) is the reference.
- The CV is updated by editing `src/content/cv/cv.md` (French) or `src/content/cv/en/cv.md` (English) in the repository and rebuilding; treat the Markdown URLs as the authoritative versions.
