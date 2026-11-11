from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class ReadingDecisionsMigration(Migration):
    """Keeps the engine's decision about the reader of each part of a run, one row per part and moment, found
    by its run and by its command."""

    number = 63
    statements = (
        "CREATE TABLE reading_decisions (id INTEGER PRIMARY KEY, process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,"
        " part_position INTEGER NOT NULL CHECK (part_position >= 1), command_key TEXT NOT NULL, moment TEXT NOT NULL, state TEXT NOT NULL,"
        " action TEXT NOT NULL, level INTEGER NOT NULL, reason TEXT NOT NULL, decided_at TEXT NOT NULL," + COMMON
        + ", UNIQUE (process_id, part_position, moment)) STRICT",
        "CREATE INDEX reading_decisions_command_time ON reading_decisions(command_key, decided_at)",
        "CREATE INDEX reading_decisions_process ON reading_decisions(process_id)",
    )
