# Komodo Labs — Portfolio Site

Personal portfolio and project showcase for [Komodo Labs](https://komodolabs.io). Built with Astro, vanilla CSS, and zero UI frameworks.

---

## Structure

```
/
├── public/
│   └── headshot.jpg
├── src/
│   ├── components/
│   │   ├── Nav.astro       # Shared navigation
│   │   └── Footer.astro    # Shared footer
│   ├── data/
│   │   └── projects.json   # Project list — edit this to add/update projects
│   └── pages/
│       ├── index.astro     # Home page
│       ├── projects.astro  # Projects table
│       └── about.astro     # About page
├── .env                    # Environment variables (not committed)
└── package.json
```

### Adding a project

Open `src/data/projects.json` and add an entry:

```json
{
  "name": "Project Name",
  "description": "What it does.",
  "labels": ["Solidity", "AI"],
  "status": "live",
  "repo": "https://github.com/org/repo",
  "website": "https://example.com"
}
```

**Status options:** `live` · `in-progress` · `complete`

Set `repo` or `website` to `null` if not applicable — icons won't render.

---

## Environment Variables

Create a `.env` file in the root:

```
PUBLIC_BOOKING_URL=your_google_calendar_link
```

For production, add this variable in your Vercel project settings under **Settings → Environment Variables**.

---

## Install & Run

```bash
npm install
npm run dev       # Dev server at http://localhost:4321
npm run build     # Production build to ./dist
npm run preview   # Preview production build locally
```
