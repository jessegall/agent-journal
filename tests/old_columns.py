import sqlite3

from journal.db.migrations.column_renames import COMMON_COLUMNS, TABLES

LATER_RENAMES = {"agents": {"has_overview": "is_overview_read"}}


def old_columns(db: sqlite3.Connection) -> None:
    """Gives a journal's tables back the column names the migrations before ColumnRenames read and write."""
    for (table,) in db.execute("SELECT name FROM sqlite_master WHERE type = 'table'").fetchall():
        for old, new in LATER_RENAMES.get(table, {}).items():
            if new in {row[1] for row in db.execute(f"PRAGMA table_info({table})")}:
                db.execute(f"ALTER TABLE {table} RENAME COLUMN {new} TO {old}")
        present = {row[1] for row in db.execute(f"PRAGMA table_info({table})")}
        for old, new in {**COMMON_COLUMNS, **TABLES.get(table, {})}.items():
            if new in present and old not in present:
                db.execute(f"ALTER TABLE {table} RENAME COLUMN {new} TO {old}")
