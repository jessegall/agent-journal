---
name: RowsThroughTheirRepository
description: Load it before reading, writing, parsing or removing a row file, or before changing the repository (RowStore) itself, so every row goes through the one place that owns the rows.
summary: Rows are read and written only by their repository; its funnel methods are final.
tier: mandatory
languages: [python]
---

# Rows through their repository

Every row of every type lives in a file that one place owns: the repository each controller holds as `rows`
(`RowStore`, controllers/stored.py). It parses a row once, keeps the parsed rows in memory, keeps the totals
and the indexes in step with every write, and refuses a row file written by anything else at run time.

## When it fires

- **`row-outside-repository`** - code reads, writes or removes a row file through a controller's `path(...)`:
  `todos.path(n).write_text(...)`, `rows.path(n).read_text()`.
- **`resource-parsed-outside-repository`** - code parses a row from text with `resource.load(text)`.

## What to do instead

- To read a row: `controller.load(n)`, `controller.find(...)`, `controller.all(...)`, or `rows.peek(n)` for the
  kept row.
- To write one: `controller.create`, `update`, `complete`, `delete`; or `rows.persist(row)` when you hold a
  row already.
- To remove one: `controller.force_delete(n)`.
- To ask a question of many rows: `rows.summaries()`, `rows.by(field, value)`, `rows.linked_to(ref)`,
  `rows.unread(actor)`, `rows.counts(name)`. Add a field to the type's `indexed` if the summaries lack it.

## Never change the repository by accident

The funnel methods of `RowStore` are marked `final` and the check `scripts/checks/repository.py` fails when a
class extends `RowStore`, replaces one of them, or when a row is read, written, parsed or made past it. An
upgrade (migrations) may rewrite rows; nothing else may.
