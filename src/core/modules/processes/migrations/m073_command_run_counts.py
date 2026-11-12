from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class CommandRunCountsMigration(Migration):
    """Keeps one count for each command of the runs that ended without a good reader, found by the command's key;
    every count starts at zero."""

    number = 73
    statements = (
        "CREATE TABLE command_run_counts (id INTEGER PRIMARY KEY, command_key TEXT NOT NULL UNIQUE,"
        " runs_without_reader INTEGER NOT NULL DEFAULT 0 CHECK (runs_without_reader >= 0)," + COMMON + ") STRICT",
    )
