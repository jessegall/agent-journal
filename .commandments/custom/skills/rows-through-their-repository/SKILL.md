---
name: RowsThroughTheirRepository
description: Load it before querying or writing a model's rows, or before changing a repository itself, so every read and write goes through the one place that owns the rows.
summary: Every query and every write of a model goes through its repository; SQL lives in repositories and the database layer only.
tier: mandatory
languages: [python]
---

# Rows through their repository

Every model's rows live in one table that one place owns: its repository in `src/journal/repositories/`.
SQL runs only there and in `src/journal/db/` (the connection, the schema, the migrations). A repository
bounds every list to a page, stamps the actor on every write and fires the model events, and keeps any rows it
holds in memory in step through `written()`.

## When it fires

- **`query-outside-repository`** - code calls `execute`, `executemany`, `all` or `one` on the connection outside
  the repositories and the database layer: a controller, a shaper, a feature or a listener writing its own SQL.

## What to do instead

- Name the question in the repository: `tasks.unfinished_count()`, `messages.window(60)`,
  `messages.sent_with(key)`, `repository.linked(kind)`. Call that.
- A list reads a page: `all()`, `where()`, `in_()` return the newest page; a read that truly needs every row
  asks for it by name: `every()`, `every_where()`, `every_in()`.
- Never filter a whole table in Python (`[m for m in messages.in_() if ...]`): put the condition in the
  repository's SQL.
- A write goes through `save`, `touch` or `delete`, never an `UPDATE` of your own.
