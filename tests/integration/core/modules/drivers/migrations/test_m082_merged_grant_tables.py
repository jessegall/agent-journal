import sqlite3

from core.modules.drivers.migrations.m082_merged_grant_tables import MergedGrantTablesMigration
from engine.database.database import Database

ROW = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL"
TABLES = f"""
    CREATE TABLE agents (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL);
    CREATE TABLE driver_grants (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL, environment_id INTEGER NOT NULL, grant_type TEXT NOT NULL, policy_key TEXT NOT NULL,
        target TEXT NOT NULL, action_fingerprint TEXT NOT NULL, asker_id INTEGER NOT NULL, reason TEXT NOT NULL, grant_state TEXT NOT NULL DEFAULT 'held', responder_id INTEGER,
        tried TEXT NOT NULL DEFAULT '', expires_at TEXT, spending_event_id TEXT NOT NULL DEFAULT '', {ROW});
    CREATE TABLE refusal_skips (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL, creator_id INTEGER NOT NULL, name TEXT NOT NULL, reason TEXT NOT NULL,
        streak INTEGER NOT NULL DEFAULT 1, used_at TEXT, restored_at TEXT, confirmed_at TEXT, cancelled_at TEXT, tried TEXT NOT NULL DEFAULT '',
        requires_approval INTEGER NOT NULL DEFAULT 0, approved_at TEXT, {ROW});
    CREATE TABLE permission_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, asker_id INTEGER NOT NULL, action TEXT NOT NULL, reason TEXT NOT NULL,
        requires_person INTEGER NOT NULL DEFAULT 0, responder_id INTEGER, state TEXT NOT NULL, {ROW});
    CREATE TABLE used_grant_records (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL, event_id TEXT NOT NULL, command_fingerprint TEXT NOT NULL, policy_key TEXT NOT NULL,
        grant_id INTEGER NOT NULL, consumed_at TEXT);
    CREATE TABLE agent_blocks (id INTEGER PRIMARY KEY, blocks_stop INTEGER NOT NULL DEFAULT 0, scope_tools INTEGER, scope_stop INTEGER, closed_at TEXT);
    INSERT INTO agents VALUES (7, 3);
    INSERT INTO driver_grants (id, session_agent_id, environment_id, grant_type, policy_key, target, action_fingerprint, asker_id, reason, grant_state, created_at, updated_at)
        VALUES (1, 7, 3, 'alias-skip', 'aliases.unknown', 'tests', 'abc', 7, 'a one-off line', 'confirmed', 't0', 't0');
    INSERT INTO refusal_skips (id, session_agent_id, creator_id, name, reason, streak, used_at, confirmed_at, tried, created_at, updated_at)
        VALUES (1, 7, 7, 'tasks.stop', 'the task waits on the user', 2, 't2', 't1', 'asked the user', 't1', 't2');
    INSERT INTO refusal_skips (id, session_agent_id, creator_id, name, reason, confirmed_at, requires_approval, created_at, updated_at)
        VALUES (2, 7, 7, 'docs.open', 'the document is read only', 't3', 1, 't3', 't3');
    INSERT INTO refusal_skips (id, session_agent_id, creator_id, name, reason, cancelled_at, created_at, updated_at) VALUES (3, 7, 7, 'docs.open', 'wrong', 't4', 't4', 't4');
    INSERT INTO permission_requests (id, environment_id, asker_id, action, reason, requires_person, responder_id, state, created_at, updated_at)
        VALUES (1, 3, 7, 'git push', 'the user asked for it', 1, 9, 'allowed', 't5', 't6');
    INSERT INTO permission_requests (id, environment_id, asker_id, action, reason, state, created_at, updated_at) VALUES (2, 3, 7, 'rm build', 'clean', 'used', 't7', 't8');
    INSERT INTO used_grant_records VALUES (1, 7, 'e1', 'f1', 'tasks.stop', 1, NULL);
    INSERT INTO used_grant_records VALUES (2, 7, 'e2', 'f2', 'rm build', 2, NULL);
    INSERT INTO used_grant_records VALUES (3, 7, 'e3', 'f3', 'aliases.unknown', 1, NULL);
    INSERT INTO agent_blocks VALUES (1, 1, NULL, NULL, 't9');
    INSERT INTO agent_blocks VALUES (2, 0, 1, 1, NULL);
"""


def migrated() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(TABLES)
    MergedGrantTablesMigration().run(Database.configured(connection))
    return connection


def rows(connection: sqlite3.Connection, query: str) -> list[tuple[object, ...]]:
    return [tuple(row) for row in connection.execute(query)]


def test_every_skip_and_permission_moves_into_the_grants_with_its_state_its_people_and_its_times():
    grants = rows(migrated(), "SELECT id, grant_type, policy_key, grant_state, asker_id, responder_id, reason, tried, consecutive_skips, requires_approval, confirmed_at, created_at"
                               " FROM driver_grants ORDER BY id")
    assert grants == [(1, "alias-skip", "aliases.unknown", "confirmed", 7, None, "a one-off line", "", 1, 0, None, "t0"),
                      (2, "refusal-skip", "tasks.stop", "spent", 7, None, "the task waits on the user", "asked the user", 2, 0, "t1", "t1"),
                      (3, "refusal-skip", "docs.open", "confirmed", 7, None, "the document is read only", "", 1, 1, "t3", "t3"),
                      (4, "refusal-skip", "docs.open", "withdrawn", 7, None, "wrong", "", 1, 0, None, "t4"),
                      (5, "permission", "git push", "approved", 7, 9, "the user asked for it", "", 1, 1, None, "t5"),
                      (6, "permission", "rm build", "spent", 7, None, "clean", "", 1, 0, None, "t7")]


def test_each_old_id_is_kept_beside_its_grant_and_a_receipt_points_at_the_moved_row():
    connection = migrated()
    sources = rows(connection, "SELECT grant_type, legacy_id, grant_id FROM driver_grant_sources ORDER BY grant_id")
    receipts = rows(connection, "SELECT id, grant_id FROM used_grant_records ORDER BY id")
    assert (sources, receipts) == ([("refusal-skip", 1, 2), ("refusal-skip", 2, 3), ("refusal-skip", 3, 4), ("permission", 1, 5), ("permission", 2, 6)], [(1, 2), (2, 6), (3, 1)])


def test_the_old_tables_go_and_every_block_keeps_its_scopes():
    connection = migrated()
    tables = {row[0] for row in rows(connection, "SELECT name FROM sqlite_master WHERE type = 'table'")}
    blocks = rows(connection, "SELECT * FROM agent_blocks ORDER BY id")
    assert (tables & {"refusal_skips", "permission_requests"}, blocks) == (set(), [(1, 0, 1, "t9"), (2, 1, 1, None)])
