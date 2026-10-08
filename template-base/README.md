# Simple Reporting Library 2 project

```bash
npm install
npx srl data import <downloaded nswow preview (zip or folder)>
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Nuxt dev server (`npm run dev:preview`: client-only preview mode) |
| `npm run build` | app (preview for nswow, `dist/app.zip`), editor (`dist/design.zip`), pdf, word, xbrl |
| `npx srl build -t generate --base /path/` | Static site from `data/` (run by nswow) |
| `npx srl add components` / `remove` / `create` | Manage livingdocs components |
| `npx srl doctor` | Check data, links and the livingdocs design |
| `npx srl update` | Update the SRL packages |

`data/` is not committed. nswow puts the current data there before running
`npm ci && npx srl build -t generate --base <path>`.
