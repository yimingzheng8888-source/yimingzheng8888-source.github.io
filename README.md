# YMG design portfolio

This repository is the canonical source for the YMG design portfolio and the
static files served by GitHub Pages.

## Structure

- `source/` — editable React/vinext source.
- `index.html`, `about/`, `_next/`, `images/`, `media/`, `files/` — generated
  GitHub Pages output.
- `tools/docx-renderer/` — lightweight DOCX-to-PNG review renderer based on
  `docx-preview`, Playwright Core, and the locally installed Chrome or Edge.

## Build

```powershell
pnpm --dir source install
pnpm --dir source build
./tools/sync-static.ps1
```

The sync script replaces only generated GitHub Pages files and preserves
`.git`, `source`, `tools`, `.gitignore`, and `README.md`. This repository does
not contain or deploy a ChatGPT Sites project.

## Review tools

- `tools/docx-renderer/` renders Word review documents to PNG files.
- `tools/site-qa.mjs` captures desktop/mobile screenshots and checks overflow,
  section backgrounds, portrait sizing, and the layout switcher.
