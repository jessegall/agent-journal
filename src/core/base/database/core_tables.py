from core.base.database.migration import Migration
from core.base.database.schema import ModuleMigrations

CORE_MODULE = "core"


class CoreTables(Migration):
    """The core's own bookkeeping, which no module owns: the event log, the commit listeners' cursors and skips,
    the refusals, and the registry sync writes."""

    number = 1
    statements = (
        "CREATE TABLE events (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL, environment_id INTEGER, row_id INTEGER NOT NULL,"
        " name TEXT NOT NULL, row_table TEXT NOT NULL, command TEXT NOT NULL, cause_id INTEGER,"
        " waivers TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(waivers)), data TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(data)),"
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


CORE_MIGRATIONS = ModuleMigrations(CORE_MODULE, (CoreTables(),))
