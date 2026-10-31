---
name: SqlInTheDatabaseLayer
description: Load it before writing a SQL statement in version 5's core, so SQL text stays in the database layer and the rest of the code names what it reads and writes.
summary: SQL text lives in base/database, base/query, migrations and a module's conditions; everything else calls a named method there.
tier: mandatory
languages: [python]
---

# SQL in the database layer

SQL text is written in four places only: `core/base/database/`, `core/base/query/`, a module's `migrations/`
and a module's `conditions/`. Everywhere else the code calls a method that says what it reads or writes.

## When it fires

- **`sql-outside-database-layer`** - a string that starts with `SELECT`, `INSERT`, `UPDATE`, `DELETE`,
  `CREATE`, `DROP`, `ALTER` or `WITH` sits in any other file.

## How to fix it

- A model's rows go through its query (`Queries.query(Model)`) and the repository; never a statement of your own.
- The core's own bookkeeping tables (events, refusals, the registry, listener cursors, actors) are read and
  written by a class in `core/base/database/` that names each operation: `BookkeepingTable.row(id)`,
  `ListenerCursorTable.start(listener)`.
- A condition a query needs and lacks is a new condition in `core/base/query/conditions/`.
