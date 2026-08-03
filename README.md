# 📚 Shelf

**A calm, personal book journal for single readers.**

Shelf was **vibe coded** — built conversationally with an AI rather than typed by hand — in Google AI Studio, connected to GitHub.
Shelf is a book-tracking app built for one reader — no social feed, no algorithm, no forced page counts. It's designed around how people actually read: you mark when you *started* a book and when you *finished* it, and everything in between stays optional. Your data lives with you and is fully exportable.

---

## Features

- **Frictionless adding** — search books via the OpenLibrary API (auto-fills cover, author, page count) or add them manually. Only a title is ever required.
- **Four shelves** — Want to Read, Reading, Finished, and DNF (with an optional reason).
- **Start/finish model** — track a start date and finish date; progress in between is approximate and never page-based.
- **Custom tags** — free-form genres you define and reuse.
- **Half-star ratings** — set on finish, from 0–5 in 0.5 steps.
- **Quotes & highlights** — save favourite lines with optional page/location, editable after creation.
- **Multiple images per book** — change the cover, and attach extra photos (e.g. snapshots of favourite passages).
- **Bookstore & spending tracker** — record where each book was bought and its price, with a per-store spending overview.
- **Reading stats** — monthly reading, rating distribution, yearly totals, top tags/genres, and an AI-generated wrap-up graphic.
- **Data ownership** — export the full library as JSON or CSV; import from Goodreads/StoryGraph CSV or a Shelf JSON backup.
- **Safe by default** — destructive actions (deleting a book or a quote) require confirmation.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| Package manager / runtime | [Bun](https://bun.sh/) |
| External data | [OpenLibrary Search API](https://openlibrary.org/developers/api) |
| Persistence | Client-side storage (browser `localStorage` via `services/storage.ts`) |

Shelf is a **client-only single-page app** — there's no backend server. All reading data is stored locally in the browser, and portability is handled through JSON/CSV export and import rather than a cloud database.

---

## Project structure

```
Shelf/
├── .github/                 # GitHub config / workflows
├── assets/                  # Static assets
├── public/                  # Public files served as-is
├── src/
│   ├── components/          # UI components (Library, Home, Stats, Stores, Add-book modal, …)
│   ├── services/
│   │   ├── openLibrary.ts   # OpenLibrary search + metadata fetching
│   │   └── storage.ts       # Local persistence, export/import
│   ├── utils/
│   │   └── formatters.ts    # Date / rating / currency formatting helpers
│   ├── App.tsx              # App shell and routing between views
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles / theme tokens
│   └── types.ts             # Shared TypeScript types (Book, ReadingSession, Quote, Store, …)
├── .env.example             # Environment variable template
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── bun.lock
```

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) installed (used as both package manager and runtime)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/hafsa-aarifeen/Shelf.git
cd Shelf

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env
# then open .env and fill in the required key(s)

# 4. Start the dev server
bun run dev
```

The app will be available at the local URL Vite prints (typically `http://localhost:5173`).

### Build & preview

```bash
bun run build      # production build to /dist
bun run preview    # serve the production build locally
```

> Check `package.json` for the exact script names if any of the above differ.

---

## Environment variables

Shelf's AI-powered features (such as the reading **wrap-up graphic**) require an API key. Copy `.env.example` to `.env` and provide your own key — the file lists the variable name(s) expected. The OpenLibrary search itself needs no key.

Never commit your real `.env` file; it's already covered by `.gitignore`.

---

## Data & privacy

All reading data is stored **locally in your browser** — nothing is uploaded to a server. This means:

- Your library is private to the device/browser you use it in.
- Clearing browser storage will remove your data, so use **Export → Full Backup (JSON)** periodically.
- You can move between devices by exporting on one and importing on another.

---

## Design notes

Shelf deliberately avoids the bright, saturated "default app" look. The palette is warm and paper-like — sand, cream, muted clay and sage — chosen to feel closer to a secondhand bookshop than a dashboard. The core philosophy throughout: **ask the reader for as little as possible.**

Because Shelf was built by describing intent rather than writing every line, the emphasis was on knowing *what* I wanted and noticing when something felt subtly off — taste over syntax. The result grew feature by feature (the bookstore tracker, multi-image books, and confirmation dialogs all came from actually living in the app) rather than from an up-front spec.

---

*Built for an audience of one — but you're welcome to fork it for yours.*
