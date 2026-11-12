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

## How to read rows

- A model's rows go through its query, `queries.query(Model)`, and the repository; never a statement of your own.
- Narrow with `where(column=value)` or `where(column, operator, value)`, `where_in`, `where_null`, `where_exists`,
  `join`; order with `order_by`, `newest` or `oldest`; `filter` is the old name of `where`.
- `get()` returns at most 50 rows: a read that finds more is cut there and the cut is reported, and in a story it
  fails. Name more with `limit(n)`, never past 1000.
- `take(n)` returns the first n rows in the order of the read, on purpose and never reported as a cut: a page, the
  newest few. `first()` returns one row.
- `every_row(reason)` walks every matching row by key, 50 at a time, and ignores the order; the reason is a sentence
  on why every row is needed, and each walk is listed in `tests/snapshots/every_row_reads.txt`.
- `count()`, `exists()`, `group_by(...).count_by()`, `counts_after(column, starts)` and `pluck(column)` count and
  read in the database, so no row is loaded to be counted.
- A condition composes the classes of `engine/query/conditions/` (`Equal`, `Among`, `AnyOf`, `AllOf`, `Exists`,
  `SubqueryMatch` on a `Select`) and returns their statement.

## The conditions that keep their text

The detectors name these files by path; the list only shrinks.

| File | Why |
|---|---|
| tasks/conditions/dependency_chain.py | a recursive walk of the task graph has no builder method |
| documents/conditions/work_context_messages.py | a recursive walk of replies |
| documents/conditions/work_context_seeds.py | a union of selects |
| documents/conditions/first_link_counterpart.py | the least id of each group over a subselect |
| documents/conditions/link_target_counts.py | a count per group over a subselect |
| documents/conditions/link_endpoint_columns.py, work_context_reference_columns.py, messages/conditions/message_text_segment.py | select columns, not conditions |
| drivers/conditions/agent_family.py | a join of agents to itself |
| drivers/conditions/foreign_hook.py | a walk of a JSON list with json_each |
| plans/conditions/earliest_unfinished_phase.py | the least of a correlated subquery |
| plans/conditions/checkpoint_limit.py | a correlated count |
| agents/conditions/current_session_rows.py | the greatest of a subselect |
| processes/queries/conditions/reader_sample_queries.py | a union of selects |
| processes/queries/conditions/watch_progress_due.py | a step of progress worked out from two tables |

## How to fix it

- The core's own bookkeeping tables (events, refusals, the registry, listener cursors, actors) are read and
  written by a class in `engine/database/` that names each operation: `BookkeepingTable.row(id)`,
  `ListenerCursorTable.start(listener)`.
- A condition a query needs and lacks is a new condition in `engine/query/conditions/`.
