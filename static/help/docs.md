# Documents

A document is lasting knowledge about the project: how something works, a design, a plan. It is written to be read again later by you and by future agent sessions.

## How documents are shaped

- A document has a title, a one-line **abstract**, an introduction and numbered **parts**.
- Every session is handed each document's abstract, so the agent knows it exists and reads it before investigating the same thing again.
- A document is a **draft** until it is marked **final**.
- Files can be attached, like diagrams or examples.

Pins, rules and to-dos can point at a document, or at one part of it.

## What you can do

- Read a document and its attachments.
- Comment on it.
- Archive one that is no longer useful. It stays readable.

## How the agent uses documents

- **Knowing what exists.** Every session starts with the list of documents and their abstracts, so the agent can find what was already worked out.
- **Reading before re-investigating.** It reads one with `journal docs <n>` and searches every line with `journal docs search <term>`.
- **Pointing at one.** A pin, rule or to-do that rests on a document cites it, so the reasoning can be found again.
