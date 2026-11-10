---
name: SqlInTheDatabaseLayer
description: Load it before writing a SQL statement in version 5's core, so SQL text stays in the database layer and the rest of the code names what it reads and writes.
summary: SQL text lives in base/database, base/query, migrations and a module's conditions; everything else calls a named method there.
tier: mandatory
languages: [python]
---

# SQL in the database layer

SQL text is written in five places only: `core/base/database/`, `engine/query/`, a module's `migrations/`,
the views a module declares in its `views.py`, and a module's `conditions/`. Everywhere else the code calls a method that says what it reads or writes.

## When it fires

- **`sql-outside-database-layer`** - a statement or SQL string, including a nested `SELECT`, sits in any
  other file. A function in `views.py` is a query builder, not a declared view.
- **`sql-condition-outside-conditions`** - a module embeds a `SELECT` condition outside its conditions
  folder. Move the condition to that folder and use its named type.

## How to fix it

- A model's rows go through its query (`Queries.query(Model)`) and the repository; never a statement of your own.
- The core's own bookkeeping tables (events, refusals, the registry, listener cursors, actors) are read and
  written by a class in `core/base/database/` that names each operation: `BookkeepingTable.row(id)`,
  `ListenerCursorTable.start(listener)`.
- A condition a query needs and lacks is a new condition in `engine/query/conditions/`.
