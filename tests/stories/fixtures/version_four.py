import sqlite3
from pathlib import Path

# The version 4 tables the upgrade reads, with the columns version 4's Schema makes from its models (id, created_at, creator,
# updated_at, updater, then the model's own fields; a scoped row also holds environment_id). Built here, never from a live journal.
COMMON = "id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, creator TEXT, updated_at TEXT, updater TEXT"
TABLES = (
    "CREATE TABLE migrations (number INTEGER PRIMARY KEY, ran_at TEXT NOT NULL)",
    f"CREATE TABLE environments ({COMMON}, name TEXT, branch TEXT, key TEXT)",
    f"CREATE TABLE agents ({COMMON}, environment_id INTEGER, session TEXT, provider TEXT, state TEXT, role TEXT)",
    f"CREATE TABLE tasks ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, priority INTEGER, state TEXT, started_at TEXT, completed_at TEXT, outcome TEXT,"
    " pause_reason TEXT, block_reason TEXT)",
    f"CREATE TABLE plans ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, state TEXT, block_reason TEXT)",
    f"CREATE TABLE messages ({COMMON}, environment_id INTEGER, author TEXT, session TEXT, text TEXT, reply_target INTEGER, read_at TEXT)",
    f"CREATE TABLE memories ({COMMON}, environment_id INTEGER, text TEXT, weight INTEGER, keywords TEXT, removed_at TEXT, expires_at TEXT)",
    f"CREATE TABLE old_reports ({COMMON}, body TEXT)",
)
STAMP = "2026-09-01T10:00:00+00:00"
ROWS = (
    ("environments", "(name, branch, key, created_at)", ("main", "development", "key-main", STAMP)),
    ("agents", "(environment_id, session, provider, state, role, created_at)", (1, "s-1", "claude", "idle", "main", STAMP)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at)", (1, "Fix the cart", "the total is wrong", 2, "open", STAMP)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at)", (1, "Ship the cart", "", 2, "started", STAMP)),
    ("plans", "(environment_id, title, brief, state, created_at)", (1, "Checkout", "", "approved", STAMP)),
    ("messages", "(environment_id, author, text, created_at)", (1, "user", "Ship the cart today", STAMP)),
    ("memories", "(environment_id, text, weight, keywords, created_at)", (1, "Totals are in cents", 5, "[]", STAMP)),
    ("old_reports", "(body, created_at)", ("a report", STAMP)),
)


def version_four_fixture(path: Path, with_rows: bool = True) -> Path:
    connection = sqlite3.connect(path)
    for statement in TABLES:
        connection.execute(statement)
    connection.execute("INSERT INTO migrations VALUES (1, ?)", (STAMP,))
    for table, columns, values in ROWS if with_rows else ():
        connection.execute(f"INSERT INTO {table} {columns} VALUES ({', '.join('?' for _ in values)})", values)
    connection.commit()
    connection.close()
    return path
