---
name: SqlInTheDatabaseLayer
description: Load it before writing a SQL statement in version 5's core, so SQL text stays in the database layer and the rest of the code names what it reads and writes.
summary: SQL text lives in engine/database, engine/query and migrations; everything else builds its read with the query builder.
tier: mandatory
languages: [python]
---

# SQL in the database layer

SQL text is written in three places only: `engine/database/`, `engine/query/` and a module's `migrations/`.
The views still listed in the detector, and the few conditions it names by path, are the last that keep their
text until they are built with the builder; that list only shrinks. Everywhere else the code builds its read with
the query builder's methods.

## When it fires

- **`sql-text-in-a-builder`** - a string holds SQL: `<column> = ?`, `IS NULL`, ` IN (`, `LIKE`, `ORDER BY`,
  `GROUP BY`, `LIMIT`, `JOIN`, `EXISTS(`, or starts with `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`,
  `DROP`, `ALTER` or `WITH`. Use `where` for `= ?`, `where_in` for `IN (`, `where_exists` for `EXISTS(`,
  `join` for `JOIN`, `group_by` for `GROUP BY`, `order_by` for `ORDER BY` and `limit` for `LIMIT`.
- **`statement-outside-the-builder`** - code builds a `Statement(...)` or runs `execute` on a connection.
  A condition composes `Select`, `Equal`, `SubqueryMatch` and the other classes of `engine/query/conditions/`
  and returns their statement.

## How to fix it

- A model's rows go through its query (`Queries.query(Model)`) and the repository; never a statement of your own.
- The core's own bookkeeping tables (events, refusals, the registry, listener cursors, actors) are read and
  written by a class in `engine/database/` that names each operation: `BookkeepingTable.row(id)`,
  `ListenerCursorTable.start(listener)`.
- A condition a query needs and lacks is a new condition in `engine/query/conditions/`.
