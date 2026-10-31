from core.base.database.migration import Migration
from core.base.database.module_migrations import ModuleMigrations
from core.base.database.core_actor_row import CoreActorRow

CORE_MODULE = "core"


class CoreTables(Migration):
    """Creates the tables the core itself needs: the actors, the event log, listener bookkeeping, refusals and the
    registry."""

    number = 1
    statements = (
        "CREATE TABLE actors (id INTEGER PRIMARY KEY, creator_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, type TEXT NOT NULL,"
        " name TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (type, name)) STRICT",
        "CREATE TABLE events (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL, environment_id INTEGER, row_id INTEGER NOT NULL,"
        " name TEXT NOT NULL, row_table TEXT NOT NULL, command TEXT NOT NULL, cause_id INTEGER,"
        " skipped_guards TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(skipped_guards)), data TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(data)),"
        " created_at TEXT NOT NULL) STRICT",
        "CREATE INDEX events_row ON events (row_table, row_id, id)",
        "CREATE INDEX events_name ON events (name, id)",
        "CREATE TABLE listener_cursors (listener TEXT PRIMARY KEY, event_id INTEGER NOT NULL) STRICT",
        "CREATE TABLE listener_skips (listener TEXT NOT NULL, event_id INTEGER NOT NULL, failures INTEGER NOT NULL,"
        " PRIMARY KEY (listener, event_id)) STRICT",
        "CREATE TABLE refusals (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL, command TEXT NOT NULL,"
        " guard TEXT NOT NULL DEFAULT '', reason TEXT NOT NULL, created_at TEXT NOT NULL) STRICT",
        "CREATE TABLE registry (id INTEGER PRIMARY KEY CHECK (id = 1), fingerprint TEXT NOT NULL,"
        " entries TEXT NOT NULL CHECK (json_valid(entries)), synced_at TEXT NOT NULL) STRICT",
    )


CORE_MIGRATIONS = ModuleMigrations(CORE_MODULE, [CoreTables(), CoreActorRow()])
