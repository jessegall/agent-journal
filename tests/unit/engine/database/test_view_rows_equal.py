from collections.abc import Iterator
import contextlib
import re
import sqlite3

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.module.journal_container import opened_container
from engine.module.module_sync import ModuleSync
from tests.unit.engine.database.old_views import OLD_VIEWS

"""Phase 6 of plan 1121: every view gives the rows it gave before it was built with the builder. One database holds
thirty-two rows in every table, with values chosen so each branch of the views' cases is met, and each view's rows are
compared with the rows of its old text. The rules of the tables are dropped first, so a seed row may hold any state
a view tells apart, not only the state a new row starts in."""

SEED_ROWS = 32
NULL_EVERY = 3
TABLES = Statement("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
                   scan_reason="The test seeds every table of a fresh journal; sqlite_master has no index.")
WORDS = {
    "state": ("open", "started", "cancelled", "completed", "testing", "blocked", "running", "background", "active", "removed", "delivered", "cut",
              "queued", "shown", "reviewing", "answered"),
    "role": ("main", "helper", "worker", "main"),
    "type": ("agent", "journal", "user", "help_request", "answer", "output"),
    "category": ("test run", "build", "edit", "read"),
    "target": ("user", "tasks:1", "tasks:2", "questions:1"),
    "hook": ("tick", "pre_tool_use", "compact", "stop"),
    "subject_model": ("task", "plan", "task", "message"),
    "row_table": ("questions", "tasks", "plans", "questions"),
    "link_type": ("comments_on", "about", "reply", "comments_on"),
    "outcome": ("none", "passed", "failed", ""),
    "cause": ("keyword", "start", "compaction", "keyword"),
}
JSON_COLUMNS = {
    "payload": ('{"received_at": "2026-11-01T10:00:00.000", "program": "claude", "agent": "2", "role": "cli", "body": {"event": "process start 3"},'
                ' "duration_ms": 5, "outcome": "allowed"}',
                '{"received_at": "2026-11-02T11:00:00.000", "role": "viewer", "body": {"event": "task show 1", "tool": {"name": "Bash", "shell": {"parts": [1, 2]}}}}',
                '{"received_at": "2026-11-02T12:00:00.000", "role": "helper", "agent": "", "body": {"hook_event_name": "Stop"}, "queued_ms": 3}',
                '{"received_at": "2026-11-03T12:00:00.000", "body": {}}'),
    "metadata": ('{"journal.core.messages": {"commented_row": {"model": "task", "id": 1}}, "journal.core.plans": {"assignee_id": 1}}', "{}",
                 '{"journal.core.drivers": {"stop_checks": ["a"]}, "journal.core.plans": {"assignee_id": 2}}', "{}"),
    "entries": ('{"helper_types": [{"key": "helper", "label": "Helper"}]}', "{}", "{}", "{}"),
}


def seed_value(table_sql: str, column: dict, row: int) -> object:
    """The value of one column in the row-th seed row: a word its table allows or a word of the views' cases, a
    small id, a time, or JSON where the table checks for JSON."""
    name, kind, nullable = column["name"], (column["type"] or "TEXT").upper(), not column["notnull"]
    phase = sum(map(ord, name))
    if column["pk"]:
        return row
    if nullable and (row + phase) % NULL_EVERY == 0:
        return None
    if name in JSON_COLUMNS:
        return JSON_COLUMNS[name][(row - 1) % len(JSON_COLUMNS[name])]
    allowed = re.search(rf"\b{name} IN \(([^)]*)\)", table_sql)
    if allowed:
        words = [word.strip().strip("'") for word in allowed[1].split(",")]
        return words[(row - 1) % len(words)]
    if re.search(rf"json_valid\({name}\)", table_sql):
        return '["a", "b"]' if row % 2 else "{}"
    if name in WORDS:
        words = WORDS[name]
        return words[row % len(words)]
    if name.endswith("_at"):
        return f"2026-11-0{row % 9 + 1}T{row % 10 + 10}:00:00+00:00"
    if "INT" in kind or "REAL" in kind:
        if name.endswith("_id") or name in ("id", "number", "version", "position"):
            return (row * 5 + phase) % SEED_ROWS + 1
        return (row + phase) % 3
    if name in ("files", "refs", "steps", "captions", "reactions", "flowchart_edges", "lines"):
        return '["a", "b"]' if row % 2 else "[]"
    return f"{name} {row}"


@pytest.fixture(scope="module")
def database(tmp_path_factory) -> Iterator[Database]:
    container = opened_container(JournalHome(tmp_path_factory.mktemp("views")))
    container.get(ModuleSync).run()
    opened = container.get(Database)
    opened.connection.execute("PRAGMA foreign_keys = OFF")
    for trigger in [row[0] for row in opened.connection.execute("SELECT name FROM sqlite_master WHERE type = 'trigger'")]:
        opened.connection.execute(f"DROP TRIGGER {trigger}")
    for table, table_sql in [(row["name"], row["sql"]) for row in opened.rows(TABLES)]:
        columns = [dict(row) for row in opened.connection.execute(f"PRAGMA table_info({table})")]
        names = ", ".join(column["name"] for column in columns)
        places = ", ".join("?" for _ in columns)
        for row in range(1, SEED_ROWS + 1):
            with contextlib.suppress(sqlite3.DatabaseError):
                opened.connection.execute(f"INSERT OR IGNORE INTO {table} ({names}) VALUES ({places})", [seed_value(table_sql, column, row) for column in columns])
    opened.connection.commit()
    yield opened
    opened.close()


def sorted_rows(database: Database, sql: str) -> list[tuple[tuple[str, object], ...]]:
    """The rows of a read in one order, each cell with the name of its type, so 1 and 1.0 and '1' differ."""
    return sorted((tuple((type(cell).__name__, cell) for cell in row) for row in database.connection.execute(sql)), key=repr)


def column_names(database: Database, sql: str) -> list[str]:
    return [column[0] for column in database.connection.execute(f"SELECT * FROM ({sql}) LIMIT 0").description]


def plan_steps(database: Database, view: str) -> list[str]:
    """The steps SQLite plans to read a view, with the view's own name and the numbers of its subqueries left out."""
    steps = database.connection.execute(f"EXPLAIN QUERY PLAN SELECT * FROM {view}")
    return [re.sub(r"\d+", "", row[3].replace(view, "the view")) for row in steps]


def test_the_old_views_are_kept_for_every_view(database):
    created = {row[0] for row in database.connection.execute("SELECT name FROM sqlite_master WHERE type = 'view'")}
    assert sorted(created) == sorted(OLD_VIEWS)


@pytest.mark.parametrize("view", sorted(OLD_VIEWS))
def test_the_view_gives_the_rows_it_gave_before(database, view):
    """The same rows with cells of the same types, the same columns in their order, and the same plan to read them."""
    database.connection.execute(f"CREATE TEMP VIEW IF NOT EXISTS {view}_old AS {OLD_VIEWS[view]}")
    assert sorted_rows(database, f"SELECT * FROM {view}") == sorted_rows(database, OLD_VIEWS[view])
    assert column_names(database, f"SELECT * FROM {view}") == column_names(database, OLD_VIEWS[view])
    assert plan_steps(database, view) == plan_steps(database, f"{view}_old")
