# DOCX review renderer

This small local renderer turns a Word document into PNG previews for design
review. It uses `docx-preview` for layout and the installed Chrome or Edge for
the final capture; no Microsoft Word automation or cloud upload is required.

```powershell
pnpm install
pnpm render -- "D:\path\review.docx" "D:\path\output"
```

The output directory contains one PNG per rendered Word section. The renderer
is intended for review documents and change lists; complex Word-only features
may still need a final check in Word.
