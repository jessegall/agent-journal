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
    " block_reason TEXT)",
    f"CREATE TABLE task_logs ({COMMON}, task_id INTEGER, line TEXT)",
    f"CREATE TABLE links ({COMMON}, source TEXT, target TEXT, link_type TEXT)",
    f"CREATE TABLE plans ({COMMON}, environment_id INTEGER, title TEXT, brief TEXT, state TEXT, block_reason TEXT)",
    f"CREATE TABLE phases ({COMMON}, plan_id INTEGER, position INTEGER, title TEXT, done_when TEXT, checkpoint INTEGER)",
    f"CREATE TABLE plan_reviews ({COMMON}, plan_id INTEGER, verdict TEXT)",
    f"CREATE TABLE messages ({COMMON}, environment_id INTEGER, author TEXT, session TEXT, text TEXT, reply_target INTEGER, read_at TEXT, data TEXT)",
    f"CREATE TABLE memories ({COMMON}, environment_id INTEGER, text TEXT, weight INTEGER, keywords TEXT, removed_at TEXT, expires_at TEXT, expiry_row TEXT)",
    f"CREATE TABLE phone_codes ({COMMON}, code TEXT)",
    f"CREATE TABLE old_reports ({COMMON}, body TEXT)",
    f"CREATE TABLE questions ({COMMON}, environment_id INTEGER, text TEXT, options TEXT, answer TEXT, recommended TEXT)",
    f"CREATE TABLE shares ({COMMON}, environment_id INTEGER, token TEXT, expires_at TEXT, approved INTEGER, password TEXT, comments INTEGER, views INTEGER, stopped_at TEXT)",
    f"CREATE TABLE phones ({COMMON}, environment_id INTEGER, name TEXT, key TEXT, expires_at TEXT, last_visited_at TEXT, ended_at TEXT, subscription TEXT, pushed TEXT,"
    " subscription_failed_at TEXT)",
    f"CREATE TABLE sent_agents ({COMMON}, environment_id INTEGER, name TEXT, brief TEXT, provider TEXT, model TEXT, session TEXT, helper_type TEXT, state TEXT)",
    f"CREATE TABLE worker_todos ({COMMON}, environment_id INTEGER, position INTEGER, text TEXT, complete INTEGER)",
    f"CREATE TABLE proofs ({COMMON}, environment_id INTEGER, point INTEGER, text TEXT, state TEXT, shortfall TEXT)",
    f"CREATE TABLE subagents ({COMMON}, environment_id INTEGER, dispatch TEXT, brief TEXT, agent_type TEXT, model TEXT, session TEXT, state TEXT, name TEXT)",
    f"CREATE TABLE sequences ({COMMON}, environment_id INTEGER, title TEXT)",
)
STAMP = "2026-09-01T10:00:00+00:00"
USER = "user:1"
EARLIER_STAMP, LATER_STAMP = "2026-01-01T00:00:00+00:00", "2036-01-01T00:00:00+00:00"
SHARE_TOKEN = "648b92de-9235-4709-a2f3-33d968a3a4bf"
ROWS = (
    ("users", "(name, email, created_at)", ("Jesse", "jesse@example.org", STAMP)),
    ("environments", "(name, branch, key, created_at, creator)", ("main", "development", "key-main", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-1", "claude", "idle", "main", STAMP, "system:")),
    ("agents", "(environment_id, session, provider, state, role, created_at, creator)", (1, "s-2", "claude", "idle", "ghost-role", STAMP, "system:")),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "memories.keyword-limit", "4", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "no.such.key", "1", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Fix the cart", "the total is wrong", 2, "open", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "Ship the cart", "", 3, "started", STAMP, "agent:s-1")),
    ("tasks", "(environment_id, title, brief, priority, state, block_reason, created_at, creator)", (1, "Wait for the price list", "", 2, "paused", "the list is late", STAMP, USER)),
    ("tasks", "(environment_id, title, brief, priority, state, created_at, creator)", (1, "A task in a lost state", "", 2, "limbo", STAMP, USER)),
    ("task_logs", "(task_id, line, created_at, creator)", (1, "the totals are worked out", STAMP, "agent:s-1")),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:2", "tasks:1", "depends", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:1", "tasks:2", "depends", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("agents:1", "tasks:2", "holds", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Checkout", "", "approved", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Payments", "", "paused", STAMP, USER)),
    ("plans", "(environment_id, title, brief, state, created_at, creator)", (1, "Cart rework", "", "reviewing", STAMP, USER)),
    ("phases", "(plan_id, position, title, done_when, checkpoint, created_at, creator)", (3, 1, "Fix the total", "the total is right", 0, STAMP, USER)),
    ("phases", "(plan_id, position, title, done_when, checkpoint, created_at, creator)", (3, 2, "Ship it", "it is live", 1, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:1", "phases:1", "in_phase", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:3", "phases:1", "in_phase", STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("tasks:2", "phases:2", "in_phase", STAMP, USER)),
    ("plan_reviews", "(plan_id, verdict, created_at)", (3, "approved", STAMP)),
    ("plan_reviews", "(plan_id, verdict, created_at)", (3, "changes", STAMP)),
    ("messages", "(environment_id, author, text, created_at, creator)", (1, "user", "Ship the cart today", STAMP, USER)),
    ("messages", "(environment_id, author, session, text, reply_target, created_at, creator)", (1, "agent", "s-1", "Shipping it", 1, STAMP, "agent:s-1")),
    ("messages", "(environment_id, author, text, data, created_at, creator)", (1, "system", "Task 1 started", '{"kind": "task_card"}', STAMP, "system:")),
    ("messages", "(environment_id, author, text, data, created_at, creator)", (1, "system", "A report", '{"kind": "report"}', STAMP, "system:")),
    ("memories", "(environment_id, text, weight, keywords, created_at, creator)", (1, "Totals are in cents", 5, '["totals"]', STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Use the old API until March", 5, "[]", EARLIER_STAMP, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expires_at, created_at, creator)", (1, "Deploy at nine", 5, "[]", LATER_STAMP, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, removed_at, created_at, creator)", (1, "A removed fact", 5, "[]", STAMP, STAMP, USER)),
    ("memories", "(environment_id, text, weight, keywords, expiry_row, created_at, creator)", (1, "Remove this when the cart task is done", 0, '["cart", "task"]', "tasks:1", STAMP, USER)),
    ("phone_codes", "(code, created_at)", ("123456", STAMP)),
    ("old_reports", "(body, created_at)", ("a report", STAMP)),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Which database?", '["Postgres", "SQLite"]', "SQLite", "SQLite", STAMP, "agent:s-1")),
    ("questions", "(environment_id, text, options, answer, recommended, created_at, creator)", (1, "Ship on Friday?", "[]", "", "", STAMP, "agent:s-1")),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, created_at, creator)", (1, SHARE_TOKEN, LATER_STAMP, 1, 0, 3, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:1", "plans:3", "shares", STAMP, USER)),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, stopped_at, created_at, creator)", (1, "stopped-token", LATER_STAMP, 1, 0, 0, STAMP, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:2", "plans:1", "shares", STAMP, USER)),
    ("shares", "(environment_id, token, expires_at, approved, comments, views, created_at, creator)", (1, "expired-token", EARLIER_STAMP, 1, 0, 0, STAMP, USER)),
    ("links", "(source, target, link_type, created_at, creator)", ("shares:3", "plans:1", "shares", STAMP, USER)),
    ("phones", "(environment_id, name, key, expires_at, created_at, creator)", (1, "Jesse's phone", "phone-key", LATER_STAMP, STAMP, USER)),
    ("sent_agents", "(environment_id, name, brief, provider, model, session, helper_type, state, created_at, creator)", (1, "Ada", "fix the cart", "claude", "sonnet", "s-3", "worker", "merged", STAMP, "agent:s-1")),
    ("worker_todos", "(environment_id, position, text, complete, created_at, creator)", (1, 1, "read the cart", 1, STAMP, "agent:s-3")),
    ("links", "(source, target, link_type, created_at, creator)", ("worker_todos:1", "tasks:1", "todo", STAMP, USER)),
    ("proofs", "(environment_id, point, text, state, created_at, creator)", (1, 1, "cart.py:12 and its test", "checked", STAMP, "agent:s-3")),
    ("links", "(source, target, link_type, created_at, creator)", ("proofs:1", "tasks:1", "proves", STAMP, USER)),
    ("subagents", "(environment_id, dispatch, brief, agent_type, model, session, state, name)", (1, "d-1", "read the cart", "Explore", "haiku", "s-1", "ended", "Darwin")),
    ("sequences", "(environment_id, title, created_at, creator)", (1, "Release steps", STAMP, USER)),
    ("settings", "(environment_id, key, value, created_at, creator)", (None, "layout", '{"tree": "a", "panes": {"a": {"tabs": ["chat", "tasks", "weather"]}}}', STAMP, USER)),
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
