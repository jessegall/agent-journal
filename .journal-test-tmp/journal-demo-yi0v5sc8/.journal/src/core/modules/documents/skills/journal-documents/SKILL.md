---
name: journal-documents
description: Write lasting knowledge as documents and what was checked as reports; read it before the first doc or report command of a session
---

# Documents and reports

A doc is lasting knowledge about this project. A report is what was checked or found, at one moment. Both have
their own numbers, so write the kind with the number: doc 12, report 3.

- `journal doc make "<title>" --abstract "<one line>" --body "<text>"` writes one; `--file <path>` takes the text from a
  file. `journal report make` takes the same.
- A subagent files its own documents and reports with these commands, even though it writes no files: they show in the
  viewer and dock in the chat. Name the number in your report rather than handing the text back.
- `journal doc show <n>` gives its outline; ask for a section, its bullets, a search or the whole with the flags
  `journal doc show --help` lists. Read narrowly.
- `journal doc edit <n> --abstract "<one line>" --body "<text>"` writes the whole text anew; `journal doc keep <n>` keeps
  the open revision, so the next edit opens a new one.
- Change a part without reading or sending the rest: `journal doc edit <n> --section <n or heading> --body "<text>"`
  replaces that section's lines, and its heading too when the text starts with one; `journal doc edit <n> --replace
  "<old>" --with "<new>"` replaces one exact piece, which must be there once. `journal report edit` takes the same.
- A save with broken Markdown is refused with the lines to fix: a code fence never closed, a table row with the wrong
  number of cells, a table without its line of dashes, a heading without its space or skipping a level, a lone backtick.
  Use a fence for code: nothing else in a document is drawn as code.
- `journal doc revisions <n>` lists its revisions and `journal doc revision <n> <k>` reads one whole.
- `journal doc close <n> --why "<reason>"` closes it as needing no action.
- `journal doc comments <n>` reads what the user wrote on it; answer in the text.
- `journal doc list` and `journal report list` name every one.
