from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class ExecutionClassesMigration(Migration):
    """Keeps the classes the person added and the built-in classes the person changed, found by their name."""

    number = 80
    statements = (
        "CREATE TABLE execution_classes (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, lane TEXT NOT NULL,"
        " slot_cost INTEGER NOT NULL CHECK (slot_cost >= 0), priority INTEGER NOT NULL, class_limit INTEGER NOT NULL,"
        " line_pattern TEXT NOT NULL DEFAULT '', plugin TEXT NOT NULL DEFAULT '', is_override INTEGER NOT NULL DEFAULT 0," + COMMON + ") STRICT",
    )
