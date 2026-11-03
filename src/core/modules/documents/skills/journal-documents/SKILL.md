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
- `journal doc edit <n> --abstract "<one line>" --body "<text>"` changes it; `journal doc keep <n>` keeps the open
  revision, so the next edit opens a new one.
- `journal doc revisions <n>` lists its revisions and `journal doc revision <n> <k>` reads one whole.
- `journal doc close <n> --why "<reason>"` closes it as needing no action.
- `journal doc comments <n>` reads what the user wrote on it; answer in the text.
- `journal doc list` and `journal report list` name every one.
