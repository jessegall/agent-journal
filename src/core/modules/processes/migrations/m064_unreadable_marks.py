from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class UnreadableMarksMigration(Migration):
    """Keeps the commands, by their leading words, whose output no reader can read, found by those words."""

    number = 64
    statements = (
        "CREATE TABLE unreadable_marks (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL, words TEXT NOT NULL CHECK (words <> ''), reason TEXT NOT NULL,"
        " note TEXT NOT NULL DEFAULT '', lifter_id INTEGER, lifted_at TEXT," + COMMON + ") STRICT",
        "CREATE INDEX unreadable_marks_words ON unreadable_marks(words)",
    )
