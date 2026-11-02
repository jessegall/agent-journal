---
name: journal-transcriptions
description: Turn a transcript into summaries, notes, documents, tasks or plans linked back to it; read it when a transcription arrives or is edited
---

# Transcriptions

A transcription is a transcript kept in the project: pasted by the user on the Transcriptions page, or fetched by you
through an MCP server that has transcripts.

- `journal transcription list` names them; `journal transcription show <n>` reads one whole.
- When one arrives or its text changes you get a line and a task to summarize it, which goes before every task but a
  critical one. Starting that task starts a sequence that takes you through it: read it, then write what it calls for,
  a summary or meeting notes as a doc, tasks, or a plan.
- Link every row you make from it: `journal transcription link <n> <model> <number>`, such as `doc 3`.
- `journal transcription make "<title>" --text "<the whole transcript>" --source <server>` adds one you fetched.
- `journal transcription sources` names the installed servers that have transcripts.
