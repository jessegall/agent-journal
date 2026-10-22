---
name: RowsThroughTheirRepository
description: Load it before querying or writing a model's rows, or before changing a repository itself, so every read and write goes through the one place that owns the rows.
summary: Every query and every write of a model goes through its repository, composed with Query; SQL text lives in the database layer only.
tier: mandatory
languages: [python]
---

# Rows through their repository

Every model's rows live in one table that one place owns: its repository in `src/journal/repositories/`.
A repository composes each read and write with the query builder, `Query` in `src/journal/db/query.py`, and
writes no SQL text: the builder renders it and the `Connection` runs it. SQL text is written only in
`src/journal/db/` (the builder, the connection, the schema, the migrations). A repository
bounds every list to a page, stamps the actor on every write and fires the model events, and keeps any rows it
holds in memory in step through `written()`.

## When it fires

- **`query-outside-repository`** - code calls `execute`, `executemany`, `executescript`, `transaction`, `all` or
  `one` on the connection outside the repositories and the database layer: a controller, a shaper, a feature or a
  listener writing its own SQL.
- **`sql-outside-database-layer`** - a string of SQL sits outside `src/journal/db/`: a repository or a feature
  writes its own query text, so its column names go unchecked.
- **`write-outside-repository`** - a file outside the repositories and the database layer imports the Connection at
  all: whatever it runs on it skips the funnel. The boot, the server's pool and the two plugin listeners that wait on
  the commit are the named exceptions, and they run no SQL.

## What to do instead

- Name the question in the repository: `tasks.unfinished_count()`, `messages.window(60)`,
  `messages.sent_with(key)`, `repository.linked(kind)`. Call that.
- A list reads a page: `all()`, `where()`, `in_()` return the newest page; a read that truly needs every row
  asks for it by name: `every()`, `every_where()`, `every_in()`.
- Never filter a whole table in Python (`[m for m in messages.in_() if ...]`): put the condition in the
  repository's query: `self.selected(self.query().filter(state=state).filter_null("closed_at").order("id"))`,
  `self.counted(...)`, `self.maximum(query, "id", 0)`, `self.purged(query)`. A JSON key is `data->key`.
- A shape the builder lacks is a method added to `Query`, never a string in the repository.
- A write goes through `save`, `touch` or `delete`, never an `UPDATE` of your own.
