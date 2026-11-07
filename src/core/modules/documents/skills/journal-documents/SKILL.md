---
name: journal-documents
description: Write lasting knowledge as documents and what was checked as reports; read it before the first doc or report command of a session
---

# Documents and reports

A doc is lasting knowledge about this project. A report is what was checked or found, at one moment. Both have
their own numbers, so write the type with the number: doc 12, report 3.

- `journal doc make "<title>" --abstract "<one line>" --body "<text>"` writes one; `--file <path>` takes the text from a
  file. `journal report make` takes the same.
- A helper files its own documents and reports with these commands, even though it writes no files: they show in the
  viewer and dock in the chat. Name the number in your report rather than handing the text back.
- A long text goes through standard input, so no word in it reads as a command, and a read-only agent files it this way:
  `journal report make "<title>" --body - <<'EOF'`, the text, then a line `EOF`. Keep the quotes around `'EOF'`.
  On macOS, a read-only shell running `/bin/bash` cannot use a here document: use zsh or pass the text to `--body`.
- `journal doc show <n>` gives its outline; ask for a section, its bullets, a search or the whole with the flags
  `journal doc show --help` lists. Read narrowly.
- Run `journal doc open <n>` before editing an existing document. Every edit belongs to that author's revision
  until `journal doc close <n>` saves it. Closing without changes adds no revision.
- While a document is open, finish it before other work: only reading files, loading skills, and reading or editing
  that document pass. Stopping is allowed; after waking, close the same document before doing other work.
- `journal doc edit <n> --abstract "<one line>" --body "<text>"` writes the whole text anew. Without an open
  revision it refuses the edit and names the open command; the saved text stays intact.
- `journal doc make` saves the whole new document in one revision and needs no open or close command.
- Each viewer edit saves a separate revision by that person. A person can close an agent's open document in the
  inspector. If an agent or helper ends, its open document closes with its text and author kept; its parent hears.
- Change a part without reading or sending the rest: `journal doc edit <n> --section <n or heading> --body "<text>"`
  replaces that section's lines, and its heading too when the text starts with one; `journal doc edit <n> --replace
  "<old>" --with "<new>"` replaces one exact piece, which must be there once. `journal report edit` takes the same.
- A save with broken Markdown is refused with the lines to fix: a code fence never closed, a table row with the wrong
  number of cells, a table without its line of dashes, a heading without its space or skipping a level, a lone backtick.
  Use a fence for code: nothing else in a document is drawn as code.
- `journal doc revisions <n>` lists its revisions and `journal doc revision <n> <k>` reads one whole.
- `journal doc settle <n> --why "<reason>"` marks it as needing no action; `journal report close` takes the same reason.
- `journal doc comments <n>` reads what the user wrote on it; answer in the text.
- `journal doc list` and `journal report list` name every one.
