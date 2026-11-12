from engine.database.migration import Migration
from core.modules.plugins.migrations.m001_plugins import ROW_COLUMNS


class QueuedRunsMigration(Migration):
    """Creates the table of the runs plugins queue, one row for each, joined to the process that runs it."""

    number = 11
    statements = (
        "CREATE TABLE queued_runs (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, plugin TEXT NOT NULL, kind TEXT NOT NULL,"
        " session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,"
        " state TEXT NOT NULL DEFAULT 'waiting', exit_code INTEGER, duration_ms INTEGER NOT NULL DEFAULT 0, timed_out INTEGER NOT NULL DEFAULT 0,"
        f" {ROW_COLUMNS}) STRICT",
        "CREATE INDEX queued_runs_process ON queued_runs (process_id)",
        "CREATE INDEX queued_runs_waiting ON queued_runs (environment_id, plugin, kind, state)",
    )
