import sqlite3
from pathlib import Path

# The version 4 tables the upgrade reads, with the columns version 4's Schema makes from its models (id, created_at, creator,
# updated_at, updater, then the model's own fields; a scoped row also holds environment_id). A creator is one string, kind:id:
# user:1, agent:s-1, system:. Built here, never from a live journal.
COMMON = "id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, creator TEXT, updated_at TEXT, updater TEXT"
TABLES = (
    "CREATE TABLE migrations (number INTEGER PRIMARY KEY, ran_at TEXT NOT NULL)",
    f"CREATE TABLE users ({COMMON}, name TEXT, email TEXT)",
    f"CREATE TABLE environments ({COMMON}, name TEXT, branch TEXT, key TEXT)",
    f"CREATE TABLE agents ({COMMON}, environment_id INTEGER, session TEXT, provider TEXT, state TEXT, role TEXT)",
    f"CREATE TABLE settings ({COMMON}, environment_id INTEGER, key TEXT, value TEXT)",
    f"CREATE TABLE tasks ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, priority INTEGER, state TEXT, started_at TEXT, completed_at TEXT, outcome TEXT,"
    " pause_reason TEXT, block_reason TEXT)",
    f"CREATE TABLE plans ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, state TEXT, block_reason TEXT)",
    f"CREATE TABLE messages ({COMMON}, environment_id INTEGER, author TEXT, session TEXT, text TEXT, reply_target INTEGER, read_at TEXT)",
    f"CREATE TABLE memories ({COMMON}, environment_id INTEGER, text TEXT, weight INTEGER, keywords TEXT, removed_at TEXT, expires_at TEXT)",
    f"CREATE TABLE phone_codes ({COMMON}, code TEXT)",
    f"CREATE TABLE old_reports ({COMMON}, body TEXT)",
)
STAMP = "2026-09-01T10:00:00+00:00"
USER = "user:1"
PAST, FUTURE = "2026-01-01T00:00:00+00:00", "2036-01-01T00:00:00+00:00"
ROWS = (
    ("users", "(name, email, created_at)", ("Jesse", "jesse@example.org", STAMP)),
    ("environments", "(name, branch, key, created_at, creator)", ("main", "development", "key-main", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-1", "claude", "idle", "main", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-2", "claude", "idle", "ghost-role", STAMP, "system:")),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "memories.keyword-limit", "4", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "no.such.key", "1", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Fix the cart", "the total is wrong", 2, "open", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Ship the cart", "", 3, "started", STAMP, "agent:s-1")),
    ("tasks", "(environment_id, title, brief, priority, state, pause_reason, created_at, creator)", (1, "Wait for the price list", "", 2, "paused", "the list is late", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "A task in a lost state", "", 2, "limbo", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Checkout", "", "approved", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Payments", "", "paused", STAMP, USER)),
    ("messages", "(environment_id, author, text, created_at, creator)", (1, "user", "Ship the cart today", STAMP, USER)),
    ("messages", "(environment_id, author, session, text, reply_target, created_at, creator)", (1, "agent", "s-1", "Shipping it", 1, STAMP, "agent:s-1")),
    ("memories", "(environment_id, text, weight, keywords, created_at, creator)", (1, "Totals are in cents", 5, '["totals"]', STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Use the old API until March", 5, "[]", PAST, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Deploy at nine", 5, "[]", FUTURE, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, removed_at, created_at, creator)", (1, "A removed fact", 5, "[]", STAMP, STAMP, USER)),
    ("phone_codes", "(code, created_at)", ("123456", STAMP)),
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
